import { inject, injectable } from "inversify";
import { GameMode } from "../../../../common/communication/iCard";
import { IGameRequest } from "../../../../common/communication/iGameRequest";
import { IArenaResponse, IOriginalPixelCluster, IPosition2D } from "../../../../common/communication/iGameplay";
import { IUser } from "../../../../common/communication/iUser";
import { Message } from "../../../../common/communication/message";
import { CCommon } from "../../../../common/constantes/cCommon";
import { Constants } from "../../constants";
import Types from "../../types";
import { UserManagerService } from "../user-manager.service";
import { Arena } from "./arena/arena";
import { Arena2D } from "./arena/arena2d";
import { IArenaInfos, IPlayerInput } from "./arena/interfaces";
import { Player } from "./arena/player";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";

const REQUEST_ERROR_MESSAGE:            string = "Game mode invalide";
const ARENA_START_ID:                   number = 1000;
const ON_ERROR_ORIGINAL_PIXEL_CLUSTER:  IOriginalPixelCluster = { differenceKey: -1, cluster: [] };

// tslint:disable:no-any
@injectable()
export class GameManagerService {

    private arenaID:    number;
    private playerList: Map<string, SocketIO.Socket>;
    private arenas:     Map<number, Arena>;
    public arena:       Arena;

    public constructor(@inject(Types.UserManagerService) private userManagerService: UserManagerService) {
        this.playerList = new Map<string, SocketIO.Socket>();
        this.arenas     = new Map<number, Arena>();
        this.arenaID    = ARENA_START_ID;
    }

    private returnError(errorMessage: string): Message {
        return {
            title:  CCommon.ON_ERROR,
            body:   errorMessage,
        };
    }

    public async analyseRequest(request: IGameRequest): Promise<Message> {
        const user: IUser | string = this.userManagerService.getUserByUsername(request.username);
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

    private async create2DArena(user: IUser, gameId: number): Promise<Message> {

        const arenaInfo: IArenaInfos = this.buildArenaInfos(user, gameId);
        this.arena = new Arena(arenaInfo, this);
        this.init2DArena().catch(() => Constants.INIT_ARENA_ERROR);
        this.arenas.set(arenaInfo.arenaId, this.arena);

        return {
            title:  CCommon.ON_SUCCESS,
            body:   arenaInfo.arenaId.toString(),
        };
    }

    private async init2DArena(): Promise<void> {
        await this.arena.prepareArenaForGameplay();
    }

    private buildArenaInfos(user: IUser, gameId: number): IArenaInfos {
        return {
            arenaId:            this.generateArenaID(),
            users:              [user],
            originalGameUrl:    Constants.PATH_TO_IMAGES + gameId + CCommon.ORIGINAL_FILE,
            differenceGameUrl:  Constants.PATH_TO_IMAGES + gameId + Constants.GENERATED_FILE,
        };
    }

    private create3DArena(request: IGameRequest): Message {
        const paths: string = JSON.stringify([
            CCommon.BASE_URL + "/scene/" + request.gameId + Constants.SCENES_FILE,
        ]);

        return {
            title:  CCommon.ON_SUCCESS,
            body:   paths,
        };
    }

    private generateArenaID(): number {
        return this.arenaID++;
    }

    public subscribeSocketID(socketID: string, socket: SocketIO.Socket): void {
        this.playerList.set(socketID, socket);
    }

    public unsubscribeSocketID(socketID: string, username: string): void {
        this.playerList.delete(socketID);
        this.removePlayerFromArena(username);
    }

    private removePlayerFromArena(username: string): void {
        this.arenas.forEach((arena: Arena) => {
            arena.getPlayers().forEach((player: Player) => {
                arena.removePlayer(username);
                if (player.username === username) {
                    arena.removePlayer(username);
                }
            });
        });
    }

    public deleteArena(arenaID: number): void {
        this.arenas.delete(arenaID);
    }

    public get userList(): Map<string, SocketIO.Socket> {
        return this.playerList;
    }

    public sendMessage(socketID: string, messageType: string, message: number): void {
        const playerSocket: SocketIO.Socket | undefined = this.playerList.get(socketID);
        if (playerSocket !== undefined) {
            playerSocket.emit(messageType, message);
        }
    }

    public async onPlayerInput(playerInput: IPlayerInput): Promise<IArenaResponse>  {
        const arena: Arena | undefined = this.arenas.get(playerInput.arenaId);
        if (arena !== undefined) {
            if (arena.contains(playerInput.user)) {
                return arena.onPlayerInput(playerInput);
            }
        }

        return {
            status:     CCommon.ON_ERROR,
            response:   ON_ERROR_ORIGINAL_PIXEL_CLUSTER,
        };
    }

    public getUsersInArena(arenaId: number): IUser[] {

        const users: IUser[]            = [];
        const arena: Arena | undefined  = this.arenas.get(arenaId);

        if (arena) {
            const players: Player[] = arena.getPlayers();

            players.forEach(( player: Player) => {
                const user: IUser = {
                    username: player.username,
                    socketID: player.userSocketId,
                };
                users.push(user);
            });
        }

        return users;
    }
}
