import { AxiosInstance, AxiosResponse } from "axios";
import { inject } from "inversify";
import { GameMode } from "../../../../../common/communication/iCard";
import { IArenaResponse } from "../../../../../common/communication/iGameplay";
import { IUser } from "../../../../../common/communication/iUser";
import Types from "../../../types";
import { GameManagerService } from "../game-manager.service";
import { I2DInfos, I3DInfos, IArenaInfos, IHitConfirmation } from "./interfaces";
import { Player } from "./player";
import { Referee } from "./referee";
import { Timer } from "./timer";

// tslint:disable:no-any
const axios: AxiosInstance = require("axios");

export abstract class Arena<IN_T, OUT_T, DIFF_T, EVT_T> {

    public ARENA_TYPE:              GameMode;
    public timer:                   Timer;

    protected readonly ERROR_ON_HTTPGET:  string = "Didn't succeed to get image buffer from URL given. File: arena.ts.";
    protected readonly ON_FAILED_CLICK:   string = "onFailedClick";
    protected readonly ON_CLICK:          string = "onClick";
    protected players:                    Player[];
    protected referee:                    Referee<any, any>;
    protected originalElements:           Map<number, DIFF_T>; // _TODO: A BOUGER DANS LES ARENA 2D et 3D

    public constructor (
        protected arenaInfos: IArenaInfos<I2DInfos | I3DInfos>,
        @inject(Types.GameManagerService) public gameManagerService: GameManagerService) {
            this.players = [];
            this.createPlayers();
            this.originalElements   = new Map<number, DIFF_T>();
            this.timer              = new Timer();
        }

    public abstract sendMessage(playerSocketId: string, event: string, message: number): void;
    public abstract async onPlayerClick(eventInfos: EVT_T, user: IUser): Promise<IArenaResponse<DIFF_T>>;
    public abstract async onPlayerInput(playerInput: IN_T):              Promise<IArenaResponse<DIFF_T>>;
    public abstract async validateHit(eventInfos: EVT_T):                Promise<IHitConfirmation>; // _TODO: Pour fin de tests (a enlever)
    public abstract async prepareArenaForGameplay():                     Promise<void>;

    public getPlayers(): Player[] {
        return this.players;
    }

    public contains(user: IUser): boolean {
        return this.players.some((player: Player) => {
            return player.username === user.username;
        });
    }

    public removePlayer(username: string): void {
        this.players = this.players.filter( (player: Player) => {
            return player.username !== username;
        });
        if (this.players.length === 0) {
            this.gameManagerService.deleteArena(this.arenaInfos);
        }
    }

    protected async getDifferenceDataFromURL(differenceDataURL: string): Promise<Buffer> {

        return axios
            .get(differenceDataURL, {
                responseType: "arraybuffer",
            })
            .then((response: AxiosResponse) => Buffer.from(response.data, "binary"))
            .catch((error: Error) => {
                throw new TypeError(this.ERROR_ON_HTTPGET);
            });
    }

    protected createPlayers(): void {
        this.arenaInfos.users.forEach((user: IUser) => {
            this.players.push(new Player(user));
        });
    }

    protected buildArenaResponse(status: string, response?: DIFF_T): IArenaResponse<DIFF_T> {

        const arenaResponse: IArenaResponse<DIFF_T> = {
            status: status,
        };

        if (response) {
            arenaResponse.response = response;
        }

        return arenaResponse;
    }
}
