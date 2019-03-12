import * as http from "http";
import { inject, injectable } from "inversify";
import * as SocketIO from "socket.io";
import { IChatSender } from "../../../common/communication/iChat";
import { IClickMessage, IPlayerInputResponse } from "../../../common/communication/iGameplay";
import { IUser } from "../../../common/communication/iUser";
import { CCommon } from "../../../common/constantes/cCommon";
import { Constants } from "../constants";
import { ChatManagerService } from "../services/chat-manager.service";
import { IPlayerInput } from "../services/game/arena/interfaces";
import { GameManagerService } from "../services/game/game-manager.service";
import { UserManagerService } from "../services/user-manager.service";
import Types from "../types";

@injectable()
export class WebsocketManager {

    private io: SocketIO.Server;

    public constructor(
        @inject(Types.UserManagerService) private userManagerService: UserManagerService,
        @inject(Types.GameManagerService) private gameManagerService: GameManagerService,
        @inject(Types.ChatManagerService) private chatManagerService: ChatManagerService) {}

    public createWebsocket(server: http.Server): void {
        this.io = SocketIO(server);
        this.io.on(Constants.CONNECTION, (socket: SocketIO.Socket) => {

            const socketID: string = "";
            const user: IUser = {
                username:       "",
                socketID:       "",
            };

            this.loginSocketChecker(user, socketID, socket);
            this.gameSocketChecker(socketID, socket);
            this.chatSocketChecker(socket);

         });
        this.io.listen(Constants.WEBSOCKET_PORT_NUMBER);
    }

    private gameSocketChecker(socketID: string, socket: SocketIO.Socket): void {

        socket.on(CCommon.GAME_CONNECTION, () => {
            socketID = socket.id;
            this.gameManagerService.subscribeSocketID(socketID, socket);
        });

        socket.on(CCommon.GAME_DISCONNECT, (username: string) => {
            this.gameManagerService.unsubscribeSocketID(socketID, username);
        });

        socket.on(Constants.POSITION_VALIDATION_EVENT, (data: IClickMessage) => {
            const user: IUser | string = this.userManagerService.getUserByUsername(data.username);
            const userList: IUser[] = this.gameManagerService.getUsersInArena(data.arenaID);

            if (typeof user !== "string") {
                const playerInput: IPlayerInput = this.buildPlayerInput(data, user);
                this.gameManagerService.onPlayerInput(playerInput)
                .then((response: IPlayerInputResponse) => {
                    socket.emit(CCommon.ON_ARENA_RESPONSE, response);
                    this.chatManagerService.sendPositionValidationMessage(data.username, userList, response, this.io);
                }).catch((error: Error) => {
                    socket.emit(CCommon.ON_ERROR, error);
                });
            }
        });
    }

    private chatSocketChecker(socket: SocketIO.Socket): void {
        socket.on(Constants.ON_CHAT_EVENT, (messageRecieved: IChatSender) => {

            const userList: IUser[] = this.gameManagerService.getUsersInArena(messageRecieved.arenaID);
            this.chatManagerService.sendChatMessage(userList, messageRecieved, this.io);
        });
    }

    private loginSocketChecker(user: IUser, socketID: string , socket: SocketIO.Socket): void {

        socket.on(CCommon.LOGIN_EVENT, (data: string) => {
            user = {
                username:       data,
                socketID:       socket.id,
            };
            this.userManagerService.updateSocketID(user);
            socket.emit(CCommon.USER_EVENT, user);
            this.chatManagerService.sendPlayerLogStatus(user.username, this.io, true);
        });

        socket.on(Constants.DISCONNECT_EVENT, () => {
            this.userManagerService.leaveBrowser(user);
            this.gameManagerService.unsubscribeSocketID(socketID, user.username);
            this.chatManagerService.sendPlayerLogStatus(user.username, this.io, false);
        });
    }

    private buildPlayerInput(data: IClickMessage, user: IUser): IPlayerInput {
        return {
            event:      Constants.CLICK_EVENT,
            arenaId:    data.arenaID,
            user:       user,
            position:   {
                x:  data.position.x,
                y:  data.position.y,
            },
        };
    }
}
