
import { inject, injectable } from "inversify";
import Types from "./../types";
import { NameValidatorService } from "../validator/NameValidatorService";

@injectable()
export class WebsocketManager {

    constructor(@inject(Types.NameValidatorService) private _nameValidatorService: NameValidatorService){
        //defualt constructor
    }

    public createWebsocket(io: any):void {
        io = require('socket.io')();
        io.on('connection', (socket: any) => { 
            
            let name: String;

            console.log("is Connected");
            socket.on("onLogin", (data: any) => {
                const result = this._nameValidatorService.validateName(data);
                if(result){
                    name = data;
                }
                socket.emit("loginReponse", result.toString() );
            });
            
            socket.on("disconnect", (data: any) => {
                this._nameValidatorService.leaveBrowser(name);

                console.log("byebye"+name);
            });
            
         });
        io.listen(3333);
    }

}