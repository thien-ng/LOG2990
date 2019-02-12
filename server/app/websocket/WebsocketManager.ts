import * as http from "http";
import { inject, injectable } from "inversify";
import * as SocketIO from "socket.io";
import { ICanvasPosition } from "../../../common/communication/iGameplay";
import { Constants } from "../constants";
import { NameValidatorService } from "../services/validator/nameValidator.service";
import Types from "../types";
import { GameManager } from "../services/game/game-manager.service";

@injectable()
export class WebsocketManager {

    private io: SocketIO.Server;

    public constructor(@inject(Types.NameValidatorService) private nameValidatorService: NameValidatorService,
                       @inject(Types.GameManager) private gameManager: GameManager) {}
    // public constructor(@inject(Types.NameValidatorService) private nameValidatorService: NameValidatorService) {}

    public createWebsocket(server: http.Server): void {
        this.io = SocketIO(server);
        this.io.on(Constants.CONNECTION, (socket: SocketIO.Socket) => {

            let name: string;
            socket.on(Constants.LOGIN_EVENT, (data: string) => {
                name = data;
            });

            socket.on(Constants.DISCONNECT_EVENT, (data: string) => {
                this.nameValidatorService.leaveBrowser(name);
            });

            socket.on(Constants.POSITION_VALIDATION_EVENT, (data: ICanvasPosition) => {
                // recover data to make validation
            });

            socket.on("onGameConnection", (data: any) => {
                console.log(socket.id.toString());
                this.gameManager.getPlayerList().push(socket.id.toString());
            });

            socket.emit("onChatMessage", {
                username: "test",
                message: "patate",
                time: "123"
            });

         });
        this.io.listen(Constants.WEBSOCKET_PORT_NUMBER);

        this.io.emit("onChatMessage", {
            username: "test",
            message: "patate",
            time: "123"
        });
    }

}
