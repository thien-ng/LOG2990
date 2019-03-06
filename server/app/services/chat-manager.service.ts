import { inject, injectable } from "inversify";
import { String } from "typescript-string-operations";
import { IChat } from "../../../common/communication/iChat";
import { IPlayerInputResponse } from "../../../common/communication/iGameplay";
import { Constants } from "../constants";
import Types from "../types";
import { TimeManagerService } from "./time-manager.service";

const LOGIN_MESSAGE: string = " vient de se connecter.";
const LOGOUT_MESSAGE: string = " vient de se déconnecter.";
const NEW_HIGHSCORE_MESSAGE: string = "{0} obtient la {1} place dans les meilleurs temps dujeu {2} en {3}";
const SERVER_NAME: string = "Serveur";
const CHAT_EVENT: string = "onChatEvent";

@injectable()
export class ChatManagerService {

    private server: SocketIO.Server;
    private socket: SocketIO.Socket;

    public constructor(@inject(Types.TimeManagerService) private timeManagerService: TimeManagerService) {}

    // send login and logout updates
    public sendPlayerLogStatus(username: string, socket: SocketIO.Server, isLogin: boolean): void {

        this.server = socket;
        const message: string = (isLogin) ? username + " " + LOGIN_MESSAGE : username + " " + LOGOUT_MESSAGE;

        const iChatMessage: IChat = this.generateMessage(SERVER_NAME, message);
        this.server.emit(CHAT_EVENT, iChatMessage);
    }

    // send message too conversation list
    public sendChatMessage(data: string, socket: SocketIO.Socket): void {

        this.socket = socket;
        // get username
        const iChatMessage: IChat = this.generateMessage(SERVER_NAME, data);
        this.socket.emit(CHAT_EVENT, iChatMessage);
    }

    // send message for highscore
    public sendNewHighScoreMessage(
        username: string,
        position: string,
        gameName: string,
        gameMode: string,
        socket: SocketIO.Server): void {

        this.server = socket;
        const message: string = String.Format(  NEW_HIGHSCORE_MESSAGE,
                                                username,
                                                position,
                                                gameName,
                                                gameMode);

        const iChatMessage: IChat = this.generateMessage(SERVER_NAME, message);
        this.server.emit(CHAT_EVENT, iChatMessage);
    }

    // send message for position validation
    public sendPositionValidationMessage(data: IPlayerInputResponse, socket: SocketIO.Socket): void {

        this.socket = socket;
        // aussi doit adapter pour multi
        const status:       string = (data.status === Constants.ON_SUCCESS_MESSAGE) ? "Différence trouvée." : "Erreur";
        const message:      string =  status;
        const iChatMessage: IChat  = this.generateMessage(SERVER_NAME, message);

        this.socket.emit(CHAT_EVENT, iChatMessage);
    }

    private generateMessage(username: string, message: string): IChat {
         return {
            username: username,
            message: message,
            time: this.timeManagerService.getTimeNow(),
        } as IChat;
    }

}
