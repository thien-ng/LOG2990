import * as http from "http";
import { inject, injectable } from "inversify";
import * as SocketIO from "socket.io";
import { Constants } from "../constants";
import { NameValidatorService } from "../services/validator/NameValidatorService";
import Types from "../types";

@injectable()
export class WebsocketManager {

    public constructor(@inject(Types.NameValidatorService) private nameValidatorService: NameValidatorService) {
        // default constructor
    }

    public createWebsocket(server: http.Server): void {
        const io: SocketIO.Server = SocketIO(server);
        io.on(Constants.CONNECTION, (socket: SocketIO.Socket) => {
            let name: String;
            socket.on(Constants.LOGIN_EVENT, (data: string) => {
                const result: Boolean = this.nameValidatorService.validateName(data);
                if (result) {
                    name = data;
                }
                socket.emit(Constants.LOGIN_RESPONSE, result.toString());
            });

            socket.on(Constants.DISCONNECT_EVENT, (data: string) => {
                this.nameValidatorService.leaveBrowser(name);
            });

         });
        io.listen(Constants.WEBSOCKET_PORT_NUMBER);
    }

}
