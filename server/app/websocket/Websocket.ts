
import { injectable } from "inversify";
import { NameValidatorService } from "../validator/NameValidatorService";

@injectable()
export class WebsocketManager {

    constructor(private _nameValidatorService: NameValidatorService){
        //defualt constructor
    }

    public createWebsocket(io: any):void {
        io = require('socket.io')();
        io.on('connection', (socket: any) => { 
            
            let name: String;

            console.log("is Connected");
            socket.on("onLogin", (data: any) => {
                const result = this._nameValidatorService.validateName(name);
                if(result){
                    name = data;
                }
                else{
                    
                }

                console.log(data);
                console.log("username: " + name);
                socket.emit("loginReponse", result.toString() );
            });
            
            socket.on("disconnect", (data: any) => {
                console.log(data + "DISCONNECTED")
                console.log("byebye"+name);
            });
            
         });
        io.listen(3333);
    }

}