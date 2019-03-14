import { inject, injectable } from "inversify";
import { GameMode } from "../../../../common/communication/iCard";
import { GameType, IGameRequest } from "../../../../common/communication/iGameRequest";
import { IOriginalPixelCluster, IPlayerInputResponse } from "../../../../common/communication/iGameplay";
import { IUser } from "../../../../common/communication/iUser";
import { Message } from "../../../../common/communication/message";
import { CCommon } from "../../../../common/constantes/cCommon";
import { Constants } from "../../constants";
import Types from "../../types";
import { UserManagerService } from "../user-manager.service";
import { Arena } from "./arena/arena";
import { IArenaInfos, IPlayerInput } from "./arena/interfaces";
import { Player } from "./arena/player";

const REQUEST_ERROR_MESSAGE:            string = "Game mode invalide";
const ARENA_START_ID:                   number = 1000;
const ON_ERROR_ORIGINAL_PIXEL_CLUSTER:  IOriginalPixelCluster = { differenceKey: -1, cluster: [] };

@injectable()
export class GameManagerService {

    private arenaID:    number;
    private lobby:      Map<number, IUser[]>;
    private playerList: Map<string, SocketIO.Socket>;
    private arenas:     Map<number, Arena>;
    public arena:       Arena;

    public constructor(@inject(Types.UserManagerService) private userManagerService: UserManagerService) {
        this.lobby      = new Map<number, IUser[]>();
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
                    if (request.type === GameType.multiPlayer) {
                        return this.verifyLobby(request, user);
                    }

                    return this.create2DArena([user], request.gameId);
                case GameMode.free:
                    if (request.type === GameType.multiPlayer) {
                        return this.verifyLobby(request, user);
                    }

                    return this.create3DArena([user], request.gameId);
                default:
                    return this.returnError(REQUEST_ERROR_MESSAGE);
            }
        }
    }

    public cancelRequest(gameID: number): Message {
        if (this.lobby.delete(gameID)) {
            return this.generateMessage(CCommon.ON_SUCCESS, gameID.toString());
        }

        return this.generateMessage(CCommon.ON_ERROR, gameID.toString());
    }

    private async verifyLobby(request: IGameRequest, user: IUser): Promise<Message> {
        const lobby: IUser[] | undefined = this.lobby.get(request.gameId);

        if (lobby === undefined) {
            this.lobby.set(request.gameId.valueOf(), [user]);

            return this.generateMessage(CCommon.ON_WAITING, CCommon.ON_WAITING);
        } else {
            let message: Message;
            lobby.push(user);
            switch (request.mode) {
                case GameMode.simple:
                    message = await this.create2DArena(lobby, request.gameId);
                    this.sendMessage(lobby[0].socketID, CCommon.ON_ARENA_CONNECT, Number(message.body));
                    this.lobby.delete(request.gameId);

                    return message;
                case GameMode.free:
                    message = this.create3DArena(lobby, request.gameId);
                    this.lobby.delete(request.gameId);

                    return message;
                default:
                    return this.generateMessage(CCommon.ON_MODE_INVALID, CCommon.ON_MODE_INVALID);
            }
        }
    }

    private generateMessage(title: string, body: string): Message {
        return {
            title: title,
            body: body,
        };
    }

    private async create2DArena(users: IUser[], gameId: number): Promise<Message> {

        const arenaInfo: IArenaInfos = this.buildArenaInfos(users, gameId);
        this.arena = new Arena(arenaInfo, this);
        this.init2DArena().catch(() => {
            return {
                title: Constants.INIT_ARENA_ERROR,
                body: Constants.INIT_ARENA_ERROR,
            };
        });
        this.arenas.set(arenaInfo.arenaId, this.arena);

        return {
            title:  CCommon.ON_SUCCESS,
            body:   arenaInfo.arenaId.toString(),
        };
    }

    private async init2DArena(): Promise<void> {
        await this.arena.prepareArenaForGameplay();
    }

    private buildArenaInfos(users: IUser[], gameId: number): IArenaInfos {
        return {
            arenaId:            this.generateArenaID(),
            users:              users,
            originalGameUrl:    Constants.PATH_TO_IMAGES + gameId + CCommon.ORIGINAL_FILE,
            differenceGameUrl:  Constants.PATH_TO_IMAGES + gameId + Constants.GENERATED_FILE,
        };
    }

    private create3DArena(users: IUser[], gameId: number): Message {
        const paths: string = JSON.stringify([
            CCommon.BASE_URL + "/scene/" + gameId + Constants.SCENES_FILE,
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

    public async onPlayerInput(playerInput: IPlayerInput): Promise<IPlayerInputResponse>  {
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
