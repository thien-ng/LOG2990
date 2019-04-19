import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import {
    IArenaResponse,
    INewScore,
    IOriginalPixelCluster,
    IPenalty,
    IPosition2D,
    ISceneObjectUpdate
} from "../../../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../../../common/communication/iSceneObject";
import { IUser } from "../../../../../common/communication/iUser";
import { CCommon } from "../../../../../common/constantes/cCommon";
import { CServer } from "../../../CServer";
import { Arena } from "./arena";
import { IHitConfirmation, IHitToValidate, IPlayerInput } from "./interfaces";
import { Player } from "./player";
import { Timer } from "./timer";

const axios:                 AxiosInstance = require("axios");
const COUNT_START:           number = 3;
const ONE_SECOND_INTERVAL:   number = 1000;
const COUNTDOWN_DONE:        number = -1;

export class Referee<EVT_T, DIFF_T> {

    private readonly ERROR_HIT_VALIDATION:  string = "Problem during Hit Validation process.";
    private readonly ON_FAILED_CLICK:       string = "onFailedClick";
    private readonly POINTS_TO_WIN_SINGLE:  number = 7;
    private readonly POINTS_TO_WIN_MULTI:   number = 4;
    private readonly PENALTY_TIMEOUT_MS:    number = 1000;

    private countdownInterval:  NodeJS.Timeout;
    private differencesFound:   number[];
    private pointsNeededToWin:  number;

    public constructor(public  arena:               Arena<
                                                        IPlayerInput<IPosition2D> | IPlayerInput<number>,
                                                        IOriginalPixelCluster | ISceneObjectUpdate<ISceneObject | IMesh>,
                                                        IPosition2D | number>,
                       private players:             Player[],
                       private originalElements:    Map<number, DIFF_T>,
                       public  timer:               Timer,
                       public  differenceDataUrl:   string,
    ) {

        this.timer = new Timer();
        this.pointsNeededToWin = players.length === 1 ? this.POINTS_TO_WIN_SINGLE : this.POINTS_TO_WIN_MULTI;

        this.differencesFound = [];
    }

    public onPlayersReady(): void {
        this.sendMessageToAllPlayers(CCommon.ON_COUNTDOWN_START, this.getAllPlayerUsername());
        this.startCountDown();
    }

    private getAllPlayerUsername(): string[] {
        const playerNameList: string[] = [];
        this.players.forEach((player: Player) => {
            playerNameList.push(player.getUsername());
        });

        return playerNameList;
    }

    private startCountDown(): void {
        let count: number = COUNT_START;
        clearInterval(this.countdownInterval);
        this.countdownInterval = setInterval(
            () => {
                if (count > COUNTDOWN_DONE) {
                    this.sendMessageToAllPlayers(CCommon.ON_COUNTDOWN, count);
                    count--;
                } else if (count === COUNTDOWN_DONE) {
                    this.sendMessageToAllPlayers(CCommon.ON_GAME_STARTED);
                    clearInterval(this.countdownInterval);
                    this.initTimer();
                }
            },
            ONE_SECOND_INTERVAL);
    }

    public cancelCountdown(): void {
        clearInterval(this.countdownInterval);
    }

    private sendMessageToAllPlayers(messageType: string, message?: number | string[]): void {
        this.players.forEach((player: Player) => {
            this.arena.sendMessage(player.getUserSocketId(), messageType, message);
        });
    }

    public async onPlayerClick(eventInfos: EVT_T, user: IUser): Promise<IArenaResponse<DIFF_T>> {

        const player: Player | undefined = this.getPlayerFromUsername(user);

        if (player === undefined) {
            return this.buildArenaResponse(this.ON_FAILED_CLICK) as IArenaResponse<DIFF_T>;
        }

        if (player.getPenaltyState()) {
            return this.buildArenaResponse(CServer.ON_PENALTY) as IArenaResponse<DIFF_T>;
        }

        return this.validateHit(eventInfos)
        .then((hitConfirmation: IHitConfirmation) => {
            return this.hitConfirmationRoutine(hitConfirmation, player);
        })
        .catch ((error: Error) => {
            return this.buildArenaResponse(CCommon.ON_ERROR);
        });
    }

    private hitConfirmationRoutine(hitConfirmation: IHitConfirmation, player: Player): IArenaResponse<DIFF_T> {
        const isAnUndiscoveredDifference: boolean = this.isAnUndiscoveredDifference(hitConfirmation.differenceIndex);
        let arenaResponse: IArenaResponse<DIFF_T> = this.buildArenaResponse(this.ON_FAILED_CLICK) as IArenaResponse<DIFF_T>;

        if (hitConfirmation.isAHit && isAnUndiscoveredDifference) {
            this.onHitConfirmation(player, hitConfirmation.differenceIndex);
            const differenceToUpdate: DIFF_T | undefined = this.originalElements.get(hitConfirmation.differenceIndex);

            if (differenceToUpdate) {
                arenaResponse = this.buildArenaResponse(CCommon.ON_SUCCESS, differenceToUpdate, player.getUsername());
            }
            if (this.gameIsFinished()) {
                this.endOfGameRoutine(player);
            }
        } else {
            this.attributePenalty(player);
        }

        return arenaResponse;
    }

    public async validateHit(eventInfos: EVT_T): Promise<IHitConfirmation> {

        const postData:     IHitToValidate<EVT_T>   = this.buildPostData(eventInfos);
        const postConfig:   AxiosRequestConfig      = this.buildPostConfig();

        return axios.post(CServer.URL_HIT_VALIDATOR + "/" + this.arena.ARENA_TYPE, postData, postConfig)
            .then((res: AxiosResponse) => {
                return res.data;
            })
            .catch((err: AxiosError) => {
                throw new TypeError(this.ERROR_HIT_VALIDATION);
            });
    }

    public getFoundDifferences(): number[] {
        return this.differencesFound;
    }

    private attributePenalty(player: Player): void {
        player.setPenaltyState(true);

        const penalty: IPenalty = {
            isOnPenalty: true,
            arenaType:   this.arena.ARENA_TYPE,
        } as IPenalty;

        this.arena.sendMessage<IPenalty>(player.getUserSocketId(), CCommon.ON_PENALTY, penalty);

        setTimeout(() => {
            penalty.isOnPenalty = false;
            this.arena.sendMessage<IPenalty>(player.getUserSocketId(), CCommon.ON_PENALTY, penalty);
            player.setPenaltyState(false);
        },         this.PENALTY_TIMEOUT_MS);
    }

    private getPlayerFromUsername(user: IUser): Player | undefined {
        return this.players.find( (player: Player) => {
            return player.getUsername() === user.username;
        });
    }

    private onHitConfirmation(player: Player, differenceIndex: number): void {
        this.attributePoints(player);
        this.addToDifferencesFound(differenceIndex);
    }

    private addToDifferencesFound(differenceIndex: number): void {
        this.differencesFound.push(differenceIndex);
    }

    private attributePoints(playerWithPoint: Player): void {
        playerWithPoint.addPoints(1);
        const message: INewScore = {
            player: playerWithPoint.getUsername(),
            score:  playerWithPoint.getPoints(),
        };
        this.arena.getPlayers().forEach((player: Player) => {
            this.arena.sendMessage(player.getUserSocketId(), CCommon.ON_POINT_ADDED, message);
        });
    }

    private isAnUndiscoveredDifference(differenceIndex: number): boolean {
        return this.differencesFound.indexOf(differenceIndex) < 0;
    }

    private initTimer(): void {
        this.timer.startTimer();
        this.timer.getTimer().subscribe((newTime: number) => {
            this.players.forEach((player: Player) => {
                this.arena.sendMessage(player.getUserSocketId(), CCommon.ON_TIMER_UPDATE, newTime);
            });
        });
    }

    private gameIsFinished(): boolean {

        const playerHasReachPointsNeeded:   boolean = this.players.some((player: Player) => player.getPoints() >= this.pointsNeededToWin );
        const differenceAreAllFound:        boolean = this.differencesFound.length >= this.originalElements.size;

        return playerHasReachPointsNeeded || differenceAreAllFound;
    }

    private endOfGameRoutine(winner: Player): void {
        const secondsSinceStart: number = this.timer.stopTimer();
        this.players.forEach((player: Player) => {
            const message: string = (player.getUsername() === winner.getUsername()) ? CCommon.ON_GAME_WON : CCommon.ON_GAME_LOST;
            this.arena.sendMessage(player.getUserSocketId(), CCommon.ON_GAME_ENDED, message);
        });
        this.arena.endOfGameRoutine(secondsSinceStart, winner);
    }

    private buildArenaResponse(status: string, response?: DIFF_T, username?: string): IArenaResponse<DIFF_T> {
        return {
            status:     status,
            response:   response,
            username:   username,
        } as IArenaResponse<DIFF_T>;
    }

    private buildPostData(eventInfos: EVT_T): IHitToValidate<EVT_T> {
        return {
            eventInfo:          eventInfos,
            differenceDataURL:  this.differenceDataUrl,
            colorToIgnore:      CServer.FF,
        } as IHitToValidate<EVT_T>;
    }

    private buildPostConfig(): AxiosRequestConfig {
        return {
            headers: {
                "Content-Type":                 "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin":  "*",
            },
        };
    }

}
