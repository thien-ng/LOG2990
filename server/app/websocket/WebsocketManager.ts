import * as http from "http";
import { inject, injectable } from "inversify";
import * as SocketIO from "socket.io";
import { IChatSender } from "../../../common/communication/iChat";
import {
    IArenaResponse,
    ICheat,
    IClickMessage,
    IOriginalPixelCluster,
    IPosition2D} from "../../../common/communication/iGameplay";
import { IUser } from "../../../common/communication/iUser";
import { CCommon } from "../../../common/constantes/cCommon";
import { CServer } from "../CServer";
import { CardOperations } from "../services/card-operations.service";
import { ChatManagerService } from "../services/chat-manager.service";
import { IPlayerInput } from "../services/game/arena/interfaces";
import { GameManagerService } from "../services/game/game-manager.service";
import { LobbyManagerService } from "../services/game/lobby-manager.service";
import { HighscoreService } from "../services/highscore.service";
import { UserManagerService } from "../services/user-manager.service";
import Types from "../types";

@injectable()
export class WebsocketManager {

    private io: SocketIO.Server;

    public constructor(
        @inject(Types.UserManagerService)   private userManagerService:     UserManagerService,
        @inject(Types.GameManagerService)   private gameManagerService:     GameManagerService,
        @inject(Types.ChatManagerService)   private chatManagerService:     ChatManagerService,
        @inject(Types.HighscoreService)     private highscoreService:       HighscoreService,
        @inject(Types.LobbyManagerService)  private lobbyManagerService:    LobbyManagerService,
        @inject(Types.CardOperations)       private cardOperations:         CardOperations) {}

    public createWebsocket(server: http.Server): void {
        this.io = SocketIO(server);
        this.io.on(CServer.CONNECTION, (socket: SocketIO.Socket) => {

            const socketID: string = "";
            const user: IUser = {
                username:       "",
                socketID:       "",
            };

            this.gameManagerService.setServer(this.io);
            this.cardOperations.setServer(this.io);
            this.highscoreService.setServer(this.io);
            this.lobbyManagerService.setServer(this.io);
            this.loginSocketChecker(user, socketID, socket);
            this.gameSocketChecker(socketID, socket);
            this.chatSocketChecker(socket);

            socket.on(CCommon.ON_GET_MODIF_LIST, (arenaID: number) => {
                const list: ICheat[] = this.gameManagerService.getDifferencesIndex(arenaID);

                socket.emit(CCommon.ON_RECEIVE_MODIF_LIST, list);
            });

         });
        this.io.listen(CServer.WEBSOCKET_PORT_NUMBER);
    }

    private gameSocketChecker(socketID: string, socket: SocketIO.Socket): void {

        socket.on(CCommon.GAME_CONNECTION, () => {
            socketID = socket.id;
            this.gameManagerService.subscribeSocketID(socketID, socket);
        });

        socket.on(CCommon.GAME_DISCONNECT, (username: string) => {
            this.gameManagerService.unsubscribeSocketID(socketID, username);
        });

        socket.on(CCommon.ON_GAME_LOADED, (arenaID: number) => {
            this.gameManagerService.onGameLoaded(socket.id, arenaID);
        });

        socket.on(CCommon.POSITION_VALIDATION, (data: IClickMessage<IPosition2D | number>) => {
            this.validatePosition(data, socket);
        });
    }

    private validatePosition(data: IClickMessage<IPosition2D | number>, socket: SocketIO.Socket): void {
        const user: IUser | string = this.userManagerService.getUserByUsername(data.username);
        const userList: IUser[]    = this.gameManagerService.getUsersInArena(data.arenaID);

        if (typeof user !== "string") {
            const playerInput: IPlayerInput<IPosition2D | number> = this.buildPlayerInput(data, user);
            this.gameManagerService.onPlayerInput(playerInput)
            // Any pour permettre le polymorphisme de la réponse
            // tslint:disable-next-line:no-any
            .then((response: IArenaResponse<IOriginalPixelCluster | any>) => {
                if (response.status !== CServer.ON_PENALTY) {
                    this.chatManagerService.sendPositionValidationMessage(data.username, userList, response, this.io);
                }
            }).catch((error: Error) => {
                socket.emit(CCommon.ON_ERROR, error);
            });
        }
    }

    private chatSocketChecker(socket: SocketIO.Socket): void {
        socket.on(CServer.ON_CHAT_EVENT, (messageRecieved: IChatSender) => {
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
            if (data) {
                this.chatManagerService.sendPlayerLogStatus(user.username, this.io, true);
            }
        });

        socket.on(CServer.DISCONNECT_EVENT, () => {
            this.userManagerService.leaveBrowser(user);
            this.gameManagerService.unsubscribeSocketID(user.socketID, user.username);
            this.chatManagerService.sendPlayerLogStatus(user.username, this.io, false);
        });
    }

    private buildPlayerInput<T>(data: IClickMessage<T>, user: IUser): IPlayerInput<T> {
        const eventInfo: T = data.value;

        return {
            event:      CServer.CLICK_EVENT,
            arenaId:    data.arenaID,
            user:       user,
            eventInfo:  eventInfo,
        };
    }
}
