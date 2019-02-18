import { injectable } from "inversify";
import { GameMode } from "../../../../common/communication/iCard";
import { IGameRequest } from "../../../../common/communication/iGameRequest";
import { Message } from "../../../../common/communication/message";
import { Constants } from "../../constants";

const ARENA_CREATED: string = "Arène Créée";
const REQUEST_ERROR_MESSAGE: string = "Game mode invalide";

@injectable()
export class GameManagerService {

    private playerList: string [];

    public constructor() {
        this.playerList = [];
    }

    public analyseRequest(request: IGameRequest): Message {
        switch (request.mode) {
            case GameMode.simple:
                return this.create2DArena();
                break;

            case GameMode.free:
                return this.create3DArena(request);
                break;

            default:
                return {
                    title: Constants.ON_ERROR_MESSAGE,
                    body: REQUEST_ERROR_MESSAGE,
                };
                break;
        }
    }

    private create2DArena(): Message {
        return {
            title: Constants.ON_SUCCESS_MESSAGE,
            body: ARENA_CREATED,
        };
    }

    private create3DArena(request: IGameRequest): Message {
        const path: string = Constants.BASE_URL + "/scene/" + request.gameId + Constants.ORIGINAL_SCENE_FILE;

        return {
            title: Constants.ON_SUCCESS_MESSAGE,
            body: path,
        };
    }

    public subscribeSocketID(socketID: string): void {
        this.playerList.push(socketID);
    }

    public unsubscribeSocketID(socketID: string): void {
        this.playerList = this.playerList.filter( (element: String) => element !== socketID);
    }

    public get userList(): string [] {
        return this.playerList;
    }
}
