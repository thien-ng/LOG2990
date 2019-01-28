
import { inject, injectable } from "inversify";
import { Socket } from "net";
import { NameValidatorService } from "../services/validator/NameValidatorService";
import Types from "./../types";

@injectable()
export class WebsocketManager {

    private SOCKET_IO: string = "socket.io";
    private CONNECTION: string = "connection";
    private LOGIN_EVENT: string = "onLogin";
    private LOGIN_RESPONSE: string = "onLoginReponse";
    private DISCONNECT_EVENT: string = "disconnect";
    private PORT_NUMBER: number = 3333;

    public constructor(@inject(Types.NameValidatorService) private _nameValidatorService: NameValidatorService) {
        // default constructor
    }

    // tslint:disable-next-line:no-any
    public createWebsocket(io: any): void {
        io = require(this.SOCKET_IO)();
        io.on(this.CONNECTION, (socket: Socket) => {
            let name: string;
            socket.on(this.LOGIN_EVENT, (data: string) => {
                const result: Boolean = this._nameValidatorService.validateName(data);
                if (result) {
                    name = data;
                }
                socket.emit(this.LOGIN_RESPONSE, result );
            });

            socket.on(this.DISCONNECT_EVENT, (data: string) => {
                this._nameValidatorService.leaveBrowser(name);
            });

         });
        io.listen(this.PORT_NUMBER);
    }

}
