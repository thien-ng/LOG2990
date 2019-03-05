import { injectable, inject } from "inversify";
import { IChat } from "../../../common/communication/iChat";
import { TimeManagerService } from "./time-manager.service";
import Types from "../types";

const LOGIN_MESSAGE: string = " vient de se connecter";
const LOGOUT_MESSAGE: string = " vient de se déconnecter";

@injectable()
export class ChatManagerService {

    public constructor(@inject(Types.TimeManagerService) private timeManagerService: TimeManagerService) {}

    // send login and logout updates
    public sendPlayerLogin(username: string, socket: SocketIO.Socket, isLogin: boolean): void {
        const message: string = (isLogin) ? username+ " " +LOGIN_MESSAGE: username+ " " + LOGOUT_MESSAGE;
        
        socket.broadcast.emit("onPlayerStatus",
            {username: "Server",
            message: message,
            time: this.timeManagerService.getTimeNow(),
        } as IChat);
    }

    // send message too conversation list
    public sendChatMessage(data: string, socket: SocketIO.Socket): void {
        socket.emit("onPlayerStatus", 
            {username: "nameHere",
            message: data,
            time: this.timeManagerService.getTimeNow(),
        } as IChat);
    }

}