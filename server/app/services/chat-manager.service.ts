import { inject, injectable } from "inversify";
import { String } from "typescript-string-operations";
import { IChat, IChatSender } from "../../../common/communication/iChat";
import { IPlayerInputResponse } from "../../../common/communication/iGameplay";
import { IUser } from "../../../common/communication/iUser";
import { CCommon } from "../../../common/constantes/cCommon";
import Types from "../types";
import { TimeManagerService } from "./time-manager.service";

const LOGIN_MESSAGE:            string = " vient de se connecter.";
const LOGOUT_MESSAGE:           string = " vient de se déconnecter.";
const NEW_HIGHSCORE_MESSAGE:    string = "{0} obtient la {1} place dans les meilleurs temps dujeu {2} en {3}";
const SERVER_NAME:              string = "Serveur";
const FIRST_POSITION:           string = "première";
const SECOND_POSITION:          string = "deuxième";
const THIRD_POSITION:           string = "troisième";
const SINGLE_GAMEMODE:          string = "solo";
const MULTI_GAMEMODE:           string = "un contre un";
const FOUND_DIFFERENCE_SOLO:    string = "Différence trouvée.";
const FOUND_DIFFERENCE_MULTI:   string = "Différence trouvée par {0}.";
const ERROR_SOLO:               string = "Erreur";
const ERROR_MULTI:              string = "Erreur par {0}.";

@injectable()
export class ChatManagerService {

    private server: SocketIO.Server;

    public constructor(@inject(Types.TimeManagerService) private timeManagerService: TimeManagerService) {}

    public sendPlayerLogStatus(username: string, socket: SocketIO.Server, isLogin: boolean): void {

        this.server = socket;
        const message: string = (isLogin) ? username + " " + LOGIN_MESSAGE : username + " " + LOGOUT_MESSAGE;

        const iChatMessage: IChat = this.generateMessage(SERVER_NAME, message);
        this.server.emit(CCommon.CHAT_EVENT, iChatMessage);
    }

    public sendChatMessage(userList: IUser[], messageRecieved: IChatSender, socket: SocketIO.Server): void {

        this.server = socket;

        const iChatMessage: IChat = this.generateMessage(messageRecieved.username, messageRecieved.message);
        this.sendToSocketIDMessage(userList, iChatMessage);
    }

    public sendNewHighScoreMessage(
        username: string,
        position: number,
        gameName: string,
        gameMode: number,
        socket: SocketIO.Server): void {

        this.server = socket;

        const stringPosition: string = this.stringifyPosition(position);
        const stringGameMode: string = (gameMode === 0) ? SINGLE_GAMEMODE : MULTI_GAMEMODE;
        const message: string = String.Format(  NEW_HIGHSCORE_MESSAGE,
                                                username,
                                                stringPosition,
                                                gameName,
                                                stringGameMode);

        const iChatMessage: IChat = this.generateMessage(SERVER_NAME, message);
        this.server.emit(CCommon.CHAT_EVENT, iChatMessage);
    }

    public sendPositionValidationMessage(username: string, userList: IUser[], data: IPlayerInputResponse, socket: SocketIO.Server): void {

        this.server = socket;

        const multiFoundDifference:  string = String.Format(FOUND_DIFFERENCE_MULTI, username);
        const multiError:            string = String.Format(ERROR_MULTI, username);

        const adaptedSuccessMessage: string = (userList.length > 1) ? multiFoundDifference : FOUND_DIFFERENCE_SOLO;
        const adaptedErrorMessage:   string = (userList.length > 1) ? multiError : ERROR_SOLO;

        const status:                string = (data.status === CCommon.ON_SUCCESS) ? adaptedSuccessMessage : adaptedErrorMessage;
        const message:               string =  status;
        const iChatMessage:          IChat  = this.generateMessage(SERVER_NAME, message);

        this.sendToSocketIDMessage(userList, iChatMessage);
    }

    public sendToSocketIDMessage(userList: IUser[], iChatMessage: IChat): void {
        userList.forEach((user: IUser) => {
            this.server.to(user.socketID).emit(CCommon.CHAT_EVENT, iChatMessage);
        });
    }

    private stringifyPosition(positionValue: number): string {

        let position: string = THIRD_POSITION;

        if (positionValue === 0) {
            position = FIRST_POSITION;
        } else if (positionValue === 1) {
            position = SECOND_POSITION;
        }

        return position;
    }

    private generateMessage(username: string, message: string): IChat {
         return {
            username: username,
            message: message,
            time: this.timeManagerService.getTimeNow(),
        } as IChat;
    }

}
