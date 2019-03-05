import { inject, injectable } from "inversify";
import { String } from "typescript-string-operations";
import { IChat } from "../../../common/communication/iChat";
import Types from "../types";
import { TimeManagerService } from "./time-manager.service";

const LOGIN_MESSAGE: string = " vient de se connecter.";
const LOGOUT_MESSAGE: string = " vient de se déconnecter.";
const NEW_HIGHSCORE_MESSAGE: string = "{0} obtient la {1} place dans les meilleurs temps dujeu {2} en {3}";
const SERVER_NAME: string = "Serveur";
const CHAT_EVENT: string = "onChatEvent";

@injectable()
export class ChatManagerService {

    public constructor(@inject(Types.TimeManagerService) private timeManagerService: TimeManagerService) {}

    // send login and logout updates
    public sendPlayerLogin(username: string, socket: SocketIO.Socket, isLogin: boolean): void {

        const message: string = (isLogin) ? username + " " + LOGIN_MESSAGE : username + " " + LOGOUT_MESSAGE;

        const iChatMessage: IChat = this.generateMessage(SERVER_NAME, message);
        socket.broadcast.emit(CHAT_EVENT, iChatMessage);
    }

    // send message too conversation list
    public sendChatMessage(data: string, socket: SocketIO.Socket): void {
        // get username
        const iChatMessage: IChat = this.generateMessage(SERVER_NAME, data);
        socket.emit(CHAT_EVENT, iChatMessage);
    }

    public sendNewHighScoreMessage(
        username: string,
        position: number,
        gameName: string,
        gameMode: string,
        socket: SocketIO.Socket): void {

        const message: string = String.Format(  NEW_HIGHSCORE_MESSAGE,
                                                username,
                                                position,
                                                gameName,
                                                gameMode);

        const iChatMessage: IChat = this.generateMessage(SERVER_NAME, message);
        socket.emit(CHAT_EVENT, iChatMessage);
    }

    private generateMessage(username: string, message: string): IChat {
         return {
            username: username,
            message: message,
            time: this.timeManagerService.getTimeNow(),
        } as IChat;
    }

}
