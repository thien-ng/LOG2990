import { inject, injectable } from "inversify";
import { GameMode } from "../../../../common/communication/iCard";
import { IGameRequest } from "../../../../common/communication/iGameRequest";
import { User } from "../../../../common/communication/iUser";
import { Message } from "../../../../common/communication/message";
import { Constants } from "../../constants";
import Types from "../../types";
import { UserManagerService } from "../user-manager.service";
import { Arena } from "./arena/arena";
import { IArenaInfos, IPlayerInput, IPlayerInputReponse } from "./arena/interfaces";

// const ARENA_CREATED: string = "Arène Créée";
const REQUEST_ERROR_MESSAGE: string = "Game mode invalide";
const ARENA_START_ID: number = 1000;

@injectable()
export class GameManagerService {

    private arenaID: number;
    private playerList: string[];
    private arenas: Map<number, Arena>;
    // private userLobby: IGameRequest[];

    public constructor(@inject(Types.UserManagerService) private userManagerService: UserManagerService) {
        this.playerList = [];
        this.arenas = new Map<number, Arena>();
        // this.userLobby = [];
        this.arenaID = ARENA_START_ID;
    }

    public async analyseRequest(request: IGameRequest): Message {
        // todo -> manage multiplyer request
        const user: User | string = this.userManagerService.getUserByUsername(request.username);
        if (typeof user === "string") {
            return {
                title: Constants.ON_ERROR_MESSAGE,
                body: Constants.USER_NOT_FOUND,
            };
        } else {
            switch (request.mode) {
                case GameMode.simple:
                    return this.create2DArena(user, request.gameId);
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
