import { inject, injectable } from "inversify";
import { HighscoreValidationResponse, Mode, Time } from "../../../../common/communication/highscore";
import { GameMode, ILobbyEvent, MultiplayerButtonText } from "../../../../common/communication/iCard";
import { IGameRequest } from "../../../../common/communication/iGameRequest";
import { IArenaResponse, ICheat, IOriginalPixelCluster, IPosition2D, ISceneObjectUpdate } from "../../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../../common/communication/iSceneObject";
import { IUser } from "../../../../common/communication/iUser";
import { Message } from "../../../../common/communication/message";
import { CCommon } from "../../../../common/constantes/cCommon";
import { CServer } from "../../CServer";
import Types from "../../types";
import { AssetManagerService } from "../asset-manager.service";
import { CardOperations } from "../card-operations.service";
import { ChatManagerService } from "../chat-manager.service";
import { HighscoreService } from "../highscore.service";
import { InterfaceBuilder } from "../interface-generator";
import { UserManagerService } from "../user-manager.service";
import { Arena } from "./arena/arena";
import { Arena2D } from "./arena/arena2d";
import { Arena3D } from "./arena/arena3d";
import { I2DInfos, I3DInfos, IArenaInfos, IPlayerInput } from "./arena/interfaces";
import { Player } from "./arena/player";
import { LobbyManagerService } from "./lobby-manager.service";

const END_OF_GAME_ERROR:                string = "END_OF_GAME_ERROR";
const REQUEST_ERROR_MESSAGE:            string = "Game mode invalide";
const ARENA_START_ID:                   number = 1000;
const ON_ERROR_ORIGINAL_PIXEL_CLUSTER:  IOriginalPixelCluster = { differenceKey: -1, cluster: [] };
const TIMEOUT_TIME:                     number = 100;

@injectable()
export class GameManagerService {
    private arenaID:            number;
    private server:             SocketIO.Server;
    private assetManager:       AssetManagerService;
    private playerList:         Map<string, SocketIO.Socket>;
    private arenas:             Map<number, Arena<
                                    IPlayerInput<IPosition2D> | IPlayerInput<number>,
                                    IOriginalPixelCluster | ISceneObjectUpdate<ISceneObject | IMesh>,
                                    IPosition2D | number>>;
    private gameIdByArenaId:    Map<number, number>;
    private interfaceBuilder:   InterfaceBuilder;

    public constructor(
        @inject(Types.UserManagerService)   private userManagerService:     UserManagerService,
        @inject(Types.HighscoreService)     private highscoreService:       HighscoreService,
        @inject(Types.ChatManagerService)   private chatManagerService:     ChatManagerService,
        @inject(Types.CardOperations)       private cardOperations:         CardOperations,
        @inject(Types.LobbyManagerService)  private lobbyManagerService:    LobbyManagerService) {
        this.arenaID            = ARENA_START_ID;
        this.assetManager       = new AssetManagerService();
        this.playerList         = new Map<string, SocketIO.Socket>();
        this.arenas             = new Map<number, Arena<
                                    IPlayerInput<IPosition2D> | IPlayerInput<number>,
                                    IOriginalPixelCluster | ISceneObjectUpdate<ISceneObject | IMesh>,
                                    IPosition2D | number>>();
        this.gameIdByArenaId    = new Map<number, number>();
        this.interfaceBuilder   = new InterfaceBuilder();
    }

    public async analyseRequest(request: IGameRequest): Promise<Message> {
        const user: IUser | string = this.userManagerService.getUserByUsername(request.username);

        if (typeof user === "string") {
            return this.interfaceBuilder.buildMessage(CCommon.ON_ERROR, CServer.USER_NOT_FOUND);
        }

        switch (request.mode) {
            case GameMode.simple:
                return (request.type === Mode.Singleplayer) ? this.create2DArena([user], request.gameId) : this.verifyLobby(request, user);
            case GameMode.free:
                return (request.type === Mode.Singleplayer) ? this.create3DArena([user], request.gameId) : this.verifyLobby(request, user);
            default:
                return this.interfaceBuilder.buildMessage(CCommon.ON_ERROR, REQUEST_ERROR_MESSAGE);
        }
    }

    private async verifyLobby(request: IGameRequest, user: IUser): Promise<Message> {
        const lobbyResult: Message = this.lobbyManagerService.verifyLobby(request, user);

        if (lobbyResult.title === CCommon.ON_WAITING) { return lobbyResult; }

        return this.multiplayerArenaRoutine(request);
    }

    private async multiplayerArenaRoutine(request: IGameRequest): Promise<Message> {
        const lobby:      IUser[] | undefined = this.lobbyManagerService.getLobby(request.gameId);
        const lobbyEvent: ILobbyEvent         = this.interfaceBuilder.buildLobbyEvent(request.gameId, MultiplayerButtonText.create);
        let   message:    Message             = this.interfaceBuilder.buildMessage(CCommon.ON_ERROR, REQUEST_ERROR_MESSAGE);

        if (!lobby) {
            return message;
        }

        switch (request.mode) {
            case GameMode.simple:
                message = await this.create2DArena(lobby, request.gameId);
                break;
            case GameMode.free:
                message = await this.create3DArena(lobby, request.gameId);
                break;
            default:
                break;
        }
        this.lobbyManagerService.deleteLobby(request.gameId);
        this.sendMessage(lobby[0].socketID, CCommon.ON_ARENA_CONNECT, Number(message.body));
        this.server.emit(CCommon.ON_LOBBY, lobbyEvent);

        return message;
    }

    public cancelRequest(gameID: number, isCardDeleted: boolean): Message {
        const successMessage:   Message     = this.interfaceBuilder.buildMessage(CCommon.ON_SUCCESS, gameID.toString());
        const errorMessage:     Message     = this.interfaceBuilder.buildMessage(CCommon.ON_ERROR, gameID.toString());
        const lobbyEvent:       ILobbyEvent = this.interfaceBuilder.buildLobbyEvent(gameID, MultiplayerButtonText.create);
        this.server.emit(CCommon.ON_LOBBY, lobbyEvent);

        const lobby: IUser[] | undefined = this.lobbyManagerService.getLobby(gameID);
        if (isCardDeleted && lobby !== undefined) {
            lobby.forEach((user: IUser) => { this.sendMessage(user.socketID, CCommon.ON_CANCEL_REQUEST); });
        }
        const cardIsDeleted: boolean = this.lobbyManagerService.deleteLobby(gameID);

        return cardIsDeleted ? successMessage : errorMessage;
    }

    private async create2DArena(users: IUser[], gameId: number): Promise<Message> {
        const arenaInfo: IArenaInfos<I2DInfos>  = this.interfaceBuilder.buildArena2DInfos(users, gameId, this.generateArenaID());
        const arena: Arena2D                    = new Arena2D(arenaInfo, this);
        this.assetManager.tempRoutine2d(gameId);
        this.gameIdByArenaId.set(arenaInfo.arenaId, gameId);
        this.initArena(arena).catch(() => CServer.INIT_ARENA_ERROR);
        this.arenas.set(arenaInfo.arenaId, arena);

        return this.interfaceBuilder.buildMessage(CCommon.ON_SUCCESS, arenaInfo.arenaId.toString());
    }

    private async create3DArena(users: IUser[], gameId: number): Promise<Message> {
        const arenaInfo: IArenaInfos<I3DInfos> = this.interfaceBuilder.buildArena3DInfos(users, gameId, this.generateArenaID());
        const arena: Arena3D = new Arena3D(arenaInfo, this);
        this.assetManager.tempRoutine3d(gameId);
        this.gameIdByArenaId.set(arenaInfo.arenaId, gameId);
        this.initArena(arena).catch(() => CServer.INIT_ARENA_ERROR);
        this.arenas.set(arenaInfo.arenaId, arena);

        return this.interfaceBuilder.buildMessage(CCommon.ON_SUCCESS, arenaInfo.arenaId.toString());
    }

    private async initArena(arena: Arena<
        IPlayerInput<IPosition2D> | IPlayerInput<number>,
        IOriginalPixelCluster | ISceneObjectUpdate<ISceneObject | IMesh>,
        IPosition2D | number>): Promise<void> {
        await arena.prepareArenaForGameplay();
    }

    public getDifferencesIndex(arenaId: number): ICheat[] {
        const arena: Arena<
                        IPlayerInput<IPosition2D> | IPlayerInput<number>,
                        IOriginalPixelCluster | ISceneObjectUpdate<ISceneObject | IMesh>,
                        IPosition2D | number> | undefined = this.arenas.get(arenaId);

        return arena ? arena.getDifferencesIds() : [];
    }

    private generateArenaID(): number {
        return this.arenaID++;
    }

    public subscribeSocketID(socketID: string, socket: SocketIO.Socket): void {
        this.playerList.set(socketID, socket);
    }

    public setServer(server: SocketIO.Server): void {
        this.server = server;
    }

    public unsubscribeSocketID(socketID: string, username: string): void {
        this.playerList.delete(socketID);
        this.removePlayerFromArena(username);

        const lobbyEvent: ILobbyEvent = this.lobbyManagerService.removePlayerFromLobby(username);
        if (lobbyEvent.gameID !== 0) {
            this.server.emit(CCommon.ON_LOBBY, lobbyEvent);
        }
    }

    private removePlayerFromArena(username: string): void {
        this.arenas.forEach((arena: Arena<
            IPlayerInput<IPosition2D> | IPlayerInput<number>,
            IOriginalPixelCluster | ISceneObjectUpdate<ISceneObject | IMesh>,
            IPosition2D | number>) => {
            arena.getPlayers().forEach((player: Player) => {
                if (player.getUsername() === username) {
                    arena.removePlayer(username);
                }
            });
        });
    }

    public deleteArena(arenaInfo: IArenaInfos<I2DInfos | I3DInfos>): void {
        const arenaId:  number              = arenaInfo.arenaId;
        const gameId:   number | undefined  = this.gameIdByArenaId.get(arenaId);
        if (gameId === undefined) { return; }
        const aliveArenaCount: number | undefined = this.assetManager.getCounter(gameId);

        if (aliveArenaCount === undefined)  { return; }
        if (aliveArenaCount === 1)          { this.deleteTempFiles(arenaInfo, gameId); }
        this.assetManager.decrementTempCounter(gameId, aliveArenaCount);
        this.arenas.delete(arenaInfo.arenaId);
    }

    private deleteTempFiles(arenaInfo: IArenaInfos<I2DInfos | I3DInfos>, gameId: number): void {
        if ("original" in arenaInfo.dataUrl) {
            this.assetManager.deleteFileInTemp(gameId, CServer.GENERATED_FILE);
            this.assetManager.deleteFileInTemp(gameId, CCommon.ORIGINAL_FILE);
        } else {
            this.assetManager.deleteFileInTemp(gameId, CCommon.SCENE_FILE);
        }
    }

    public get userList(): Map<string, SocketIO.Socket> {
        return this.playerList;
    }

    public sendMessage<DATA_T>(socketID: string, event: string, data?: DATA_T): void {
        const playerSocket: SocketIO.Socket | undefined = this.playerList.get(socketID);
        if (playerSocket !== undefined) { playerSocket.emit(event, data); }
    }

    public async onPlayerInput(playerInput: IPlayerInput<IPosition2D | number>):
        Promise<IArenaResponse<IOriginalPixelCluster |  ISceneObjectUpdate<ISceneObject | IMesh>>>  {
        const arena: Arena<
            IPlayerInput<IPosition2D> | IPlayerInput<number>,
            IOriginalPixelCluster | ISceneObjectUpdate<ISceneObject | IMesh>,
            IPosition2D | number> | undefined
            = this.arenas.get(playerInput.arenaId);
        if (arena !== undefined) {
            if (arena.contains(playerInput.user)) {
                // Any pour pouvoir utiliser le polymorphisme
                // tslint:disable-next-line:no-any
                return  arena.onPlayerInput(playerInput as IPlayerInput<any>);
            }
        }

        return {
            status:     CCommon.ON_ERROR,
            response:   ON_ERROR_ORIGINAL_PIXEL_CLUSTER,
        };
    }

    public getUsersInArena(arenaId: number): IUser[] {
        const users: IUser[] = [];
        const arena: Arena<
            IPlayerInput<IPosition2D> | IPlayerInput<number>,
            IOriginalPixelCluster | ISceneObjectUpdate<ISceneObject | IMesh>,
            IPosition2D | number> | undefined
            = this.arenas.get(arenaId);

        if (arena) {
            const players: Player[] = arena.getPlayers();
            players.forEach(( player: Player) => {
                const user: IUser = this.interfaceBuilder.buildIUser(player.getUsername(), player.getUserSocketId());
                users.push(user);
            });
        }

        return users;
    }

    public endOfGameRoutine(newTime: Time, mode: Mode, arenaInfo: IArenaInfos<I2DInfos | I3DInfos>, arenaType: GameMode): void {
        const gameID: number | undefined = this.gameIdByArenaId.get(arenaInfo.arenaId);
        if (gameID === undefined) { return; }
        const title: string = this.cardOperations.getCardById(gameID.toString(), arenaType).title;

        this.highscoreService.updateHighscore(newTime, mode, gameID)
        .then((answer: HighscoreValidationResponse) => {
            if (answer.status === CCommon.ON_ERROR) {
                setTimeout(() => { this.chatManagerService.sendDeletedHighscoreMessage(newTime.username, this.server); }, TIMEOUT_TIME);
            } else if (answer.status === CCommon.ON_SUCCESS && answer.isNewHighscore) {
                this.chatManagerService.sendNewHighScoreMessage(newTime.username, title, mode, this.server, answer.index);
                this.server.emit(CCommon.ON_NEW_SCORE, gameID);
            }
            this.deleteArena(arenaInfo);
        }).catch(() => END_OF_GAME_ERROR);
    }

    public onGameLoaded(socketID: string, arenaID: number): void {
        const arena: Arena<
                        IPlayerInput<IPosition2D> | IPlayerInput<number>,
                        IOriginalPixelCluster | ISceneObjectUpdate<ISceneObject | IMesh>,
                        IPosition2D | number> | undefined
                        = this.arenas.get(arenaID);
        if (!arena) {
            return;
        }
        arena.onPlayerReady(socketID);
    }
}
