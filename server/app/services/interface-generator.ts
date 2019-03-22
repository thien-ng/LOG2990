import { ILobbyEvent, MultiplayerButtonText } from "../../../common/communication/iCard";
import { IUser } from "../../../common/communication/iUser";
import { Message } from "../../../common/communication/message";
import { CCommon } from "../../../common/constantes/cCommon";
import { Constants } from "../constants";
import { I2DInfos, I3DInfos, IArenaInfos } from "./game/arena/interfaces";

export class InterfaceBuilder {

    public buildMessage(title: string, message: string): Message {
        return {
            title:  title,
            body:   message,
        };
    }

    public buildLobbyEvent(gameID: number, buttonText: MultiplayerButtonText): ILobbyEvent {
        return {
            gameID:      gameID,
            buttonText: buttonText,
        };
    }

    public buildArena2DInfos(users: IUser[], gameId: number, arenaId: number): IArenaInfos<I2DInfos> {
        return {
            arenaId:            arenaId,
            users:              users,
            dataUrl: {
                original:   Constants.PATH_SERVER_TEMP + gameId + CCommon.ORIGINAL_FILE,
                difference: Constants.PATH_SERVER_TEMP + gameId + Constants.GENERATED_FILE,
            },
        };
    }

    public buildArena3DInfos(users: IUser[], gameId: number, arenaId: number): IArenaInfos<I3DInfos> {
        return {
            arenaId:            arenaId,
            users:              users,
            dataUrl:  {
                sceneData:  Constants.PATH_SERVER_TEMP + gameId + CCommon.SCENE_FILE,
            },
        };
    }

    public buildIUser(name: string, id: string): IUser {
        return {
            username: name,
            socketID: id,
        };
    }

}
