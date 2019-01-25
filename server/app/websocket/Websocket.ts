
import { inject, injectable } from "inversify";
import Types from "./../types";
import { NameValidatorService } from "../validator/NameValidatorService";

@injectable()
export class WebsocketManager {

    private SOCKET_IO = "socket.io";
    private CONNECTION = "connection";
    private LOGIN_EVENT = "onLogin";
    private LOGIN_RESPONSE = "onLoginReponse";
    private DISCONNECT_EVENT = "disconnect";
    private PORT_NUMBER = 3333;

    constructor(@inject(Types.NameValidatorService) private _nameValidatorService: NameValidatorService){
        //defualt constructor
    }

    public createWebsocket(io: any):void {
        io = require(this.SOCKET_IO)();
        io.on(this.CONNECTION, (socket: any) => {
            let name: String;
            socket.on(this.LOGIN_EVENT, (data: String) => {
                const result = this._nameValidatorService.validateName(data);
                if(result){
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