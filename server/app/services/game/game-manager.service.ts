import { inject, injectable } from "inversify";
import { GameMode } from "../../../../common/communication/iCard";
import { IGameRequest } from "../../../../common/communication/iGameRequest";
import { IOriginalPixelCluster, IPlayerInputResponse } from "../../../../common/communication/iGameplay";
import { User } from "../../../../common/communication/iUser";
import { Message } from "../../../../common/communication/message";
import { Constants } from "../../constants";
import Types from "../../types";
import { UserManagerService } from "../user-manager.service";
import { Arena } from "./arena/arena";
import { IArenaInfos, IPlayerInput } from "./arena/interfaces";

const REQUEST_ERROR_MESSAGE: string = "Game mode invalide";
const ARENA_START_ID: number = 1000;
const ON_ERROR_ORIGINAL_PIXEL_CLUSTER: IOriginalPixelCluster = { differenceKey: -1, cluster: [] };

@injectable()
export class GameManagerService {

    private arenaID: number;
    private playerList: string[];
    private arenas: Map<number, Arena>;

    public constructor(@inject(Types.UserManagerService) private userManagerService: UserManagerService) {
        this.playerList = [];
        this.arenas = new Map<number, Arena>();
        this.arenaID = ARENA_START_ID;
    }

    private returnError(errorMessage: string): Message {
        return {
            title: Constants.ON_ERROR_MESSAGE,
            body: errorMessage,
        };
    }

    public async analyseRequest(request: IGameRequest): Promise<Message> {
        const user: User | string = this.userManagerService.getUserByUsername(request.username);
        if (typeof user === "string") {
            return this.returnError(Constants.USER_NOT_FOUND);
        } else {
            switch (request.mode) {
                case GameMode.simple:
                    return this.create2DArena(user, request.gameId);
                case GameMode.free:
                    return this.create3DArena(request);
                default:
                    return this.returnError(REQUEST_ERROR_MESSAGE);
            }
        }
    }

    private async create2DArena(user: User, gameId: number): Promise<Message> {

        const arenaInfo: IArenaInfos = this.buildArenaInfos(user, gameId);
        const newArena: Arena = new Arena(arenaInfo);
        await newArena.prepareArenaForGameplay();
        this.arenas.set(arenaInfo.arenaId, newArena);

        return {
            title:  Constants.ON_SUCCESS_MESSAGE,
            body:   arenaInfo.arenaId.toString(),
        };
    }

    private buildArenaInfos(user: User, gameId: number): IArenaInfos {
        return {
            arenaId:            this.generateArenaID(),
            users:              [user],
            originalGameUrl:    Constants.PATH_TO_IMAGES + gameId + Constants.ORIGINAL_FILE,
            differenceGameUrl:  Constants.PATH_TO_IMAGES + gameId + Constants.GENERATED_FILE,
        };
    }

    private create3DArena(request: IGameRequest): Message {
        const paths: string = JSON.stringify([
            Constants.BASE_URL + "/scene/" + request.gameId + Constants.SCENES_FILE,
        ]);

        return {
            title: Constants.ON_SUCCESS_MESSAGE,
            body: paths,
        };
    }

    private generateArenaID(): number {
        return this.arenaID++;
    }

    public subscribeSocketID(socketID: string): void {
        this.playerList.push(socketID);
    }

    public unsubscribeSocketID(socketID: string): void {
        this.playerList = this.playerList.filter((element: String) => element !== socketID);
    }

    public get userList(): string[] {
        return this.playerList;
    }

    public async onPlayerInput(playerInput: IPlayerInput): Promise<IPlayerInputResponse>  {
        const arena: Arena | undefined = this.arenas.get(playerInput.arenaId);
        if (arena !== undefined) {
            if (arena.contains(playerInput.user)) {
                return arena.onPlayerInput(playerInput);
            }
        }

        return {
            status: Constants.ON_ERROR_MESSAGE,
            response: ON_ERROR_ORIGINAL_PIXEL_CLUSTER,
        };
    }
}
