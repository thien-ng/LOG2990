import { AxiosInstance, AxiosResponse } from "axios";
import { inject } from "inversify";
import { GameMode } from "../../../../../common/communication/iCard";
import { IArenaResponse } from "../../../../../common/communication/iGameplay";
import { IUser } from "../../../../../common/communication/iUser";
import Types from "../../../types";
import { GameManagerService } from "../game-manager.service";
import { IArenaInfos, IHitConfirmation } from "./interfaces";
import { Player } from "./player";
// import { Referee } from "./referee";
import { Timer } from "./timer";

const axios: AxiosInstance = require("axios");

    public readonly ARENA_TYPE: GameMode = GameMode.simple;
    public DEFAULT_DIFF_TO_UPDATE: DIFF_T;
export abstract class Arena<IN_T, OUT_T, DIFF_T, EVT_T> {

    public ARENA_TYPE:              GameMode;
    public DEFAULT_DIFF_TO_UPDATE:  DIFF_T;
    public  timer:                  Timer;

    protected readonly ERROR_ON_HTTPGET:  string = "Didn't succeed to get image buffer from URL given. File: arena.ts.";
    protected readonly ON_FAILED_CLICK:   string = "onFailedClick";
    protected readonly ON_CLICK:          string = "onClick";
    protected players:                    Player[];
    // protected referee:                    Referee<any, DIFF_T, any>;
    protected originalElements:           Map<number, DIFF_T>; // _TODO: A BOUGER DANS LES ARENA 2D et 3D

    public constructor (
        protected arenaInfos: IArenaInfos,
        @inject(Types.GameManagerService) public gameManagerService: GameManagerService) {
            this.players = [];
            this.createPlayers();
            this.originalElements   = new Map<number, DIFF_T>();
            this.timer              = new Timer();
        }

    public sendMessage(playerSocketId: string, event: string, message: number): void {
        this.gameManagerService.sendMessage(playerSocketId, event, message);
    }

    public abstract async onPlayerClick(eventInfos: EVT_T, user: IUser): Promise<IArenaResponse<DIFF_T>>;
    public abstract async validateHit(eventInfos: EVT_T):                Promise<IHitConfirmation>; // _TODO: Pour fin de tests (a enlever)
    public abstract async onPlayerInput(playerInput: IN_T):              Promise<IArenaResponse<DIFF_T>>;
    public abstract async prepareArenaForGameplay():    Promise<void>;
    public getPlayers(): Player[] {
    }

    public contains(user: IUser): boolean {
    }

    public removePlayer(username: string): void {
    }

    protected async getDifferenceDataFromURL(differenceDataURL: string): Promise<Buffer> {
    }

    protected createPlayers(): void {
    }

    protected buildPlayerInputResponse(status: string, response: DIFF_T): IArenaResponse<DIFF_T> {
    }
}
