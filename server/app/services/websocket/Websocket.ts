
import { inject, injectable } from "inversify";
import { Socket } from "net";
import { Constants } from "../../constants";
import { NameValidatorService } from "../../services/validator/NameValidatorService";
import Types from "./../../types";

@injectable()
export class WebsocketManager {

    public constructor(@inject(Types.NameValidatorService) private _nameValidatorService: NameValidatorService) {
        // default constructor
    }

    // tslint:disable-next-line:no-any
    public createWebsocket(io: any): void {
        io = require(Constants.SOCKET_IO)();
        io.on(Constants.CONNECTION, (socket: Socket) => {
            let name: String;
            socket.on(Constants.LOGIN_EVENT, (data: String) => {
                const result: Boolean = this._nameValidatorService.validateName(data);
                if (result) {
                    name = data;
                }
                socket.emit(Constants.LOGIN_RESPONSE, result.toString() );
            });

            socket.on(Constants.DISCONNECT_EVENT, (data: String) => {
                this._nameValidatorService.leaveBrowser(name);
            });

         });
        io.listen(Constants.PORT_NUMBER);
    }
}
