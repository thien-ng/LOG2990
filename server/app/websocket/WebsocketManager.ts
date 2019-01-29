import * as http from "http";
import { inject, injectable } from "inversify";
import * as SocketIO from "socket.io";
import { Constants } from "../constants";
import { NameValidatorService } from "../services/validator/NameValidatorService";
import Types from "../types";

@injectable()
export class WebsocketManager {

    public constructor(@inject(Types.NameValidatorService) private _nameValidatorService: NameValidatorService) {
        // default constructor
    }

    public createWebsocket(server: http.Server): void {
        const io: SocketIO.Server = SocketIO(server);
        io.on(Constants.CONNECTION, (socket: SocketIO.Socket) => {
            let name: String;
            socket.on(Constants.LOGIN_EVENT, (data: string) => {
                const result: Boolean = this._nameValidatorService.validateName(data);
                if (result) {
                    name = data;
                }
                socket.emit(Constants.LOGIN_RESPONSE, result.toString());
            });

            socket.on(Constants.DISCONNECT_EVENT, (data: string) => {
                this._nameValidatorService.leaveBrowser(name);
            });

         });
        io.listen(Constants.WEBSOCKET_PORT_NUMBER);
    }

}
