import * as http from "http";
import { inject, injectable } from "inversify";
import * as SocketIO from "socket.io";
import { IChat } from "../../../common/communication/iChat";
import { ICanvasPosition } from "../../../common/communication/iGameplay";
import { Constants } from "../constants";
import { GameManager } from "../services/game/game-manager.service";
import { NameValidatorService } from "../services/validator/nameValidator.service";
import Types from "../types";

@injectable()
export class WebsocketManager {

    private io: SocketIO.Server;

    public constructor(@inject(Types.NameValidatorService) private nameValidatorService: NameValidatorService,
                       @inject(Types.GameManager) private gameManager: GameManager) {}

    public createWebsocket(server: http.Server): void {
        this.io = SocketIO(server);
        this.io.on(Constants.CONNECTION, (socket: SocketIO.Socket) => {

            const name: string = "";
            const socketID: string = "";

            this.loginSocketChecker(name, socketID, socket);
            this.gameSocketChecker(socketID, socket);

         });
        this.io.listen(Constants.WEBSOCKET_PORT_NUMBER);

    }

    private gameSocketChecker(socketID: string, socket: SocketIO.Socket): void {

        socket.on(Constants.GAME_CONNECTION, () => {
            socketID = socket.id;
            this.gameManager.subscribeSocketID(socketID);
        });

        socket.on(Constants.GAME_DISCONNECT, () => {
            this.gameManager.unsubscribeSocketID(socketID);
        });

        socket.on(Constants.POSITION_VALIDATION_EVENT, (data: ICanvasPosition) => {

            // a new message should be returned
            const message: IChat = {
                username: "test",
                message: "x: " + data.positionX + " y: " + data.positionY + " ( ͡° ͜ʖ ͡°)",
                time: "1:30 pm",
            };
            
            socket.emit(Constants.CHAT_MESSAGE, message);
        });
    }

    private loginSocketChecker(name: string, socketID: string , socket: SocketIO.Socket): void {

        socket.on(Constants.LOGIN_EVENT, (data: string) => {
            name = data;
        });

        socket.on(Constants.DISCONNECT_EVENT, (data: string) => {
            this.nameValidatorService.leaveBrowser(name);
            this.gameManager.unsubscribeSocketID(socketID);
        });
    }

}
