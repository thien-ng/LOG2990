import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { inject } from "inversify";
import { IUser } from "../../../../../common/communication/iUser";
import { Constants } from "../../../constants";
import Types from "../../../types";
import { GameManagerService } from "../game-manager.service";
import { DifferencesExtractor } from "./differencesExtractor";
import { Player } from "./player";

import {
    IOriginalPixelCluster,
    IPlayerInputResponse,
    IPosition2D,
} from "../../../../../common/communication/iGameplay";
import {
    IArenaInfos,
    IHitConfirmation,
    IHitToValidate,
    IPlayerInput,
} from "./interfaces";
import { Timer } from "./timer";

const axios: AxiosInstance = require("axios");

export class Arena {

    private readonly ERROR_ON_HTTPGET:      string = "Didn't succeed to get image buffer from URL given. File: arena.ts.";
    private readonly ERROR_HIT_VALIDATION:  string = "Problem during Hit Validation process.";
    private readonly ON_FAILED_CLICK:       string = "onFailedClick";
    private readonly USER_EVENT:            string = "onClick";
    private readonly POINTS_TO_WIN_SINGLE:  number = 7;
    private readonly POINTS_TO_WIN_MULTI:   number = 4;

    private pointsNeededToWin:      number;
    private differencesFound:       number[];
    private players:                Player[];
    public timer:                   Timer;
    private originalPixelClusters:  Map<number, IOriginalPixelCluster>;

    public constructor(
        private arenaInfos: IArenaInfos,
        @inject(Types.GameManagerService) public gameManagerService: GameManagerService) {
        this.players = [];
        this.createPlayers();
        this.originalPixelClusters = new Map<number, IOriginalPixelCluster>();
        this.timer = new Timer();
        this.pointsNeededToWin = arenaInfos.users.length === 1 ? this.POINTS_TO_WIN_SINGLE : this.POINTS_TO_WIN_MULTI;
        this.differencesFound = [];
        this.initTimer();
    }

    public async validateHit(position: IPosition2D): Promise<IHitConfirmation> {

        const postData:     IHitToValidate      = this.buildPostData(position);
        const postConfig:   AxiosRequestConfig  = this.buildPostConfig();

        return axios.post(Constants.URL_HIT_VALIDATOR, postData, postConfig)
            .then((res: AxiosResponse) => {
                return res.data;
            })
            .catch((err: AxiosError) => {
                throw new TypeError(this.ERROR_HIT_VALIDATION);
            });
    }

    public async onPlayerInput(playerInput: IPlayerInput): Promise<IPlayerInputResponse> {

        let response: IPlayerInputResponse = this.buildPlayerInputResponse(
            this.ON_FAILED_CLICK,
            Constants.ON_ERROR_PIXEL_CLUSTER,
        );

        switch (playerInput.event) {
            case this.USER_EVENT:
                response = await this.onPlayerClick(playerInput.position, playerInput.user);
                break;
            default:
                break;
        }

        return response;
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
            this.gameManagerService.deleteArena(this.arenaInfos.arenaId);
        }
    }

    public async onPlayerClick(position: IPosition2D, user: IUser): Promise<IPlayerInputResponse> {

        let inputResponse: IPlayerInputResponse = this.buildPlayerInputResponse(
            this.ON_FAILED_CLICK,
            Constants.ON_ERROR_PIXEL_CLUSTER,
            );

        return this.validateHit(position)
        .then((hitConfirmation: IHitConfirmation) => {

            const isAnUndiscoveredDifference: boolean = this.isAnUndiscoveredDifference(hitConfirmation.hitPixelColor[0]);

            if (hitConfirmation.isAHit && isAnUndiscoveredDifference) {
                this.onHitConfirmation(user, hitConfirmation);
                const pixelCluster: IOriginalPixelCluster | undefined = this.originalPixelClusters.get(hitConfirmation.hitPixelColor[0]);

                if (pixelCluster !== undefined) {
                    inputResponse = this.buildPlayerInputResponse(Constants.ON_SUCCESS_MESSAGE, pixelCluster);
                }
                if (this.gameIsFinished()) {
                    this.endOfGameRoutine();
                }
            }

            return inputResponse;
        })
        .catch ((error: Error) => {
            return this.buildPlayerInputResponse(Constants.ON_ERROR_MESSAGE, Constants.ON_ERROR_PIXEL_CLUSTER);
        });
    }

    private onHitConfirmation(user: IUser, hitConfirmation: IHitConfirmation): void {
        this.attributePoints(user);
        this.addToDifferencesFound(hitConfirmation.hitPixelColor[0]);
    }

    private initTimer(): void {
        this.timer.startTimer();
        this.timer.getTimer().subscribe((newTime: number) => {
            this.players.forEach((player: Player) => {
                this.gameManagerService.sendMessage(player.userSocketId, Constants.ON_TIMER_UPDATE, newTime);
            });
        });
    }

    private endOfGameRoutine(): void {
        this.timer.stopTimer();
    }

    private addToDifferencesFound(differenceIndex: number): void {
        this.differencesFound.push(differenceIndex);
    }

    private isAnUndiscoveredDifference(differenceIndex: number): boolean {
        return this.differencesFound.indexOf(differenceIndex) < 0;
    }

    private attributePoints(user: IUser): void {
        const player: Player | undefined = this.players.find( (p: Player) => {
            return p.username === user.username;
        });

        if (player !== undefined) {
            player.addPoints(1);
            this.gameManagerService.sendMessage(player.userSocketId, Constants.ON_POINT_ADDED, player.points);
        }
    }

    private gameIsFinished(): boolean {

        const playerHasReachPointsNeeded: boolean = this.players.some((player: Player) => {
            return player.points >= this.pointsNeededToWin;
        });
        const differenceAreAllFound: boolean = this.differencesFound.length >= this.originalPixelClusters.size;

        return playerHasReachPointsNeeded || differenceAreAllFound;
    }

    private buildPlayerInputResponse(status: string, response: IOriginalPixelCluster): IPlayerInputResponse {
        return {
            status: status,
            response: response,
        };
    }

    public async prepareArenaForGameplay(): Promise<void> {
        await this.extractOriginalPixelClusters();
    }

    private async extractOriginalPixelClusters(): Promise<void> {
        const originalImage:    Buffer              = await this.getImageFromUrl(this.arenaInfos.originalGameUrl);
        const differenceImage:  Buffer              = await this.getImageFromUrl(this.arenaInfos.differenceGameUrl);
        const extractor:        DifferencesExtractor = new DifferencesExtractor();
        this.originalPixelClusters = extractor.extractPixelClustersFrom(originalImage, differenceImage);
    }

    private async getImageFromUrl(imageUrl: string): Promise<Buffer> {

        return axios
            .get(imageUrl, {
                responseType: "arraybuffer",
            })
            .then((response: AxiosResponse) => Buffer.from(response.data, "binary"))
            .catch((error: Error) => {
                throw new TypeError(this.ERROR_ON_HTTPGET);
            });
    }

    private buildPostData(position: IPosition2D): IHitToValidate {
        return {
            position:       position,
            imageUrl:       this.arenaInfos.differenceGameUrl,
            colorToIgnore:  Constants.WHITE,
        };
    }

    private buildPostConfig(): AxiosRequestConfig {
        return {
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
            },
        };
    }

    private createPlayers(): void {
        this.arenaInfos.users.forEach((user: IUser) => {
            this.players.push(new Player(user));
        });
    }

    public getPlayers(): Player[] {
        return this.players;
    }

}
