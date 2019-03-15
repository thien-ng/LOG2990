import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { IArenaResponse } from "../../../../../common/communication/iGameplay";
import { IUser } from "../../../../../common/communication/iUser";
import { CCommon } from "../../../../../common/constantes/cCommon";
import { Constants } from "../../../constants";
import { Arena } from "./arena";
import { IHitConfirmation, IHitToValidate } from "./interfaces";
import { Player } from "./player";
import { Timer } from "./timer";

const axios: AxiosInstance = require("axios");

export class Referee<EVT_T, DIFF_T> {

    private readonly ERROR_HIT_VALIDATION:  string = "Problem during Hit Validation process.";
    private readonly ON_FAILED_CLICK:       string = "onFailedClick";
    private readonly POINTS_TO_WIN_SINGLE:  number = 7;
    private readonly POINTS_TO_WIN_MULTI:   number = 4;

    private differencesFound:   number[];
    private pointsNeededToWin:  number;

    // _TODO: Enlever les any après les avoir remplacés
    // tslint:disable-next-line:no-any
    public constructor(public  arena:               Arena<any, any, any, any>,
                       private players:             Player[],
                       private originalElements:    Map<number, DIFF_T>,
                       public  timer:               Timer,
                       public  differenceDataUrl:   string,
    ) {

        this.timer = new Timer();
        // _TODO: sortir ca de la (ca devrait aller dans le GameManager)
        this.pointsNeededToWin = players.length === 1 ? this.POINTS_TO_WIN_SINGLE : this.POINTS_TO_WIN_MULTI;

        this.differencesFound = [];
        this.initTimer();
    }

    public async onPlayerClick(eventInfos: EVT_T, user: IUser): Promise<IArenaResponse<DIFF_T>> {

        let arenaResponse: IArenaResponse<DIFF_T> = this.buildArenaResponse(
            this.ON_FAILED_CLICK,
        ) as IArenaResponse<DIFF_T>;

        return this.validateHit(eventInfos)
        .then((hitConfirmation: IHitConfirmation) => {
            const isAnUndiscoveredDifference: boolean = this.isAnUndiscoveredDifference(hitConfirmation.differenceIndex);

            if (hitConfirmation.isAHit && isAnUndiscoveredDifference) {
                this.onHitConfirmation(user, hitConfirmation);
                const differenceToUpdate: DIFF_T | undefined = this.originalElements.get(hitConfirmation.differenceIndex);

                if (differenceToUpdate !== undefined) {
                    arenaResponse = this.buildArenaResponse(CCommon.ON_SUCCESS, differenceToUpdate);
                }
                if (this.gameIsFinished()) {
                    this.endOfGameRoutine();
                }
            }

            return arenaResponse;
        })
        .catch ((error: Error) => {
            return this.buildArenaResponse(CCommon.ON_ERROR);
        });
    }

    public async validateHit(eventInfos: EVT_T): Promise<IHitConfirmation> {

        const postData:     IHitToValidate<EVT_T>   = this.buildPostData(eventInfos);
        const postConfig:   AxiosRequestConfig      = this.buildPostConfig();

        return axios.post(Constants.URL_HIT_VALIDATOR + "/" + this.arena.ARENA_TYPE, postData, postConfig)
            .then((res: AxiosResponse) => {
                return res.data;
            })
            .catch((err: AxiosError) => {
                throw new TypeError(this.ERROR_HIT_VALIDATION);
            });
    }

    private onHitConfirmation(user: IUser, hitConfirmation: IHitConfirmation): void {
        this.attributePoints(user);
        this.addToDifferencesFound(hitConfirmation.differenceIndex);
    }

    private addToDifferencesFound(differenceIndex: number): void {
        this.differencesFound.push(differenceIndex);
    }

    private attributePoints(user: IUser): void {
        const foundPlayer: Player | undefined = this.players.find( (player: Player) => {
            return player.username === user.username;
        });

        if (foundPlayer !== undefined) {
            foundPlayer.addPoints(1);
            this.arena.sendMessage(foundPlayer.userSocketId, CCommon.ON_POINT_ADDED, foundPlayer.points);
        }
    }

    private isAnUndiscoveredDifference(differenceIndex: number): boolean {
        return this.differencesFound.indexOf(differenceIndex) < 0;
    }

    private initTimer(): void {
        this.timer.startTimer();
        this.timer.getTimer().subscribe((newTime: number) => {
            this.players.forEach((player: Player) => {
                this.arena.sendMessage(player.userSocketId, CCommon.ON_TIMER_UPDATE, newTime);
            });
        });
    }

    private gameIsFinished(): boolean {

        const playerHasReachPointsNeeded:   boolean = this.players.some((player: Player) => player.points >= this.pointsNeededToWin );
        const differenceAreAllFound:        boolean = this.differencesFound.length >= this.originalElements.size;

        return playerHasReachPointsNeeded || differenceAreAllFound;
    }

    private endOfGameRoutine(): void {
        this.timer.stopTimer();
    }

    private buildArenaResponse(status: string, response?: DIFF_T): IArenaResponse<DIFF_T> {
        return {
            status:     status,
            response:   response,
        } as IArenaResponse<DIFF_T>;
    }

    private buildPostData(eventInfos: EVT_T): IHitToValidate<EVT_T> {
        return {
            eventInfo:          eventInfos,
            differenceDataURL:  this.differenceDataUrl,
            colorToIgnore:      Constants.FF,
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
