
import { inject, injectable } from "inversify";
import { NameValidatorService } from "../validator/NameValidatorService";
import Types from "./../types";

@injectable()
export class WebsocketManager {

    private SOCKET_IO: string = "socket.io";
    private CONNECTION: String = "connection";
    private LOGIN_EVENT: String = "onLogin";
    private LOGIN_RESPONSE: String = "onLoginReponse";
    private DISCONNECT_EVENT: String = "disconnect";
    private PORT_NUMBER: number = 3333;

    public constructor(@inject(Types.NameValidatorService) private _nameValidatorService: NameValidatorService) {
        // defualt constructor
    }

    public createWebsocket(io: any): void {
        io = require(this.SOCKET_IO)();
        io.on(this.CONNECTION, (socket: any) => {
            let name: String;
            socket.on(this.LOGIN_EVENT, (data: String) => {
                const result: Boolean = this._nameValidatorService.validateName(data);
                if (result) {
                    name = data;
                }
                socket.emit(this.LOGIN_RESPONSE, result.toString() );
            });

            socket.on(this.DISCONNECT_EVENT, (data: String) => {
                this._nameValidatorService.leaveBrowser(name);
            });

         });
        io.listen(this.PORT_NUMBER);
    }
    
}