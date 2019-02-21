import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { User } from "../../../../../common/communication/iUser";
import { Constants } from "../../../constants";
import { DifferencesExtractor } from "./differencesExtractor";
import { Player } from "./player";

import { inject } from "inversify";
import {
    IOriginalPixelCluster,
    IPlayerInputResponse,
    IPosition2D,
} from "../../../../../common/communication/iGameplay";
import { GameManagerService } from "../game-manager.service";
import {
    IArenaInfos,
    IHitConfirmation,
    IHitToValidate,
    IPlayerInput,
} from "./interfaces";

import Types from "../../../types";

const FF: number = 255;
const WHITE: number[] = [FF, FF, FF];
const URL_HIT_VALIDATOR: string = "http://localhost:3000/api/hitvalidator";
const ON_ERROR_ORIGINAL_PIXEL_CLUSTER: IOriginalPixelCluster = { differenceKey: -1, cluster: [] };
const ONE_SECOND: number = 1000;

export class Arena {

    private readonly ERROR_ON_HTTPGET:      string = "Didn't succeed to get image buffer from URL given. File: arena.ts.";
    private readonly ERROR_HIT_VALIDATION:  string = "Problem during Hit Validation process.";
    private readonly ON_FAILED_CLICK:       string = "onFailedClick";
    private readonly USER_EVENT:            string = "onClick";

    private time: number;
    private players:               Player[];
    private originalPixelClusters:  Map<number, IOriginalPixelCluster>;

    public constructor(
        private arenaInfos: IArenaInfos,
        @inject(Types.GameManagerService) private gameManagerService: GameManagerService,
        ) {
        this.players = [];
        this.time = 0;
        this.createPlayers();
        this.originalPixelClusters = new Map<number, IOriginalPixelCluster>();
        this.timer();
    }

    public async validateHit(position: IPosition2D): Promise<IHitConfirmation> {

        const axios:        AxiosInstance       = require("axios");
        const postData:     IHitToValidate      = this.buildPostData(position);
        const postConfig:   AxiosRequestConfig  = this.buildPostConfig();

        return axios.post(URL_HIT_VALIDATOR, postData, postConfig)
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
            ON_ERROR_ORIGINAL_PIXEL_CLUSTER,
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

    public contains(user: User): boolean {
        return this.players.some((player: Player) => {
            return player.username === user.username;
        });
    }

    public removePlayer(username: string): void {

        this.players = this.players.filter( (player: Player) => {
            return player.username !== username;
        });
    }

    private timer(): void {
        setInterval(() => {
            this.players.forEach((player: Player) => {
                this.gameManagerService.sendMessage(player.userSocketId, this.time);
                this.time++;
            });
        },          ONE_SECOND);
    }

    private async onPlayerClick(position: IPosition2D, user: User): Promise<IPlayerInputResponse> {

        let inputResponse: IPlayerInputResponse = this.buildPlayerInputResponse(
            this.ON_FAILED_CLICK,
            ON_ERROR_ORIGINAL_PIXEL_CLUSTER,
            );

        return this.validateHit(position)
        .then((hitConfirmation: IHitConfirmation) => {
            if (hitConfirmation.isAHit) {

                const pixelCluster: IOriginalPixelCluster | undefined = this.originalPixelClusters.get(hitConfirmation.hitPixelColor[0]);

                if (pixelCluster !== undefined) {
                    inputResponse = this.buildPlayerInputResponse(
                        Constants.ON_SUCCESS_MESSAGE,
                        pixelCluster,
                    );
                }
            }

            return inputResponse;
        })
        .catch ((error: Error) => {
            return this.buildPlayerInputResponse(Constants.ON_ERROR_MESSAGE, ON_ERROR_ORIGINAL_PIXEL_CLUSTER);
        });
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

        const originalImage:   Buffer = await this.getImageFromUrl(this.arenaInfos.originalGameUrl);
        const differenceImage: Buffer = await this.getImageFromUrl(this.arenaInfos.differenceGameUrl);
        const extractor: DifferencesExtractor = new DifferencesExtractor();
        this.originalPixelClusters = extractor.extractPixelClustersFrom(originalImage, differenceImage);
    }

    private async getImageFromUrl(imageUrl: string): Promise<Buffer> {

        const axios: AxiosInstance = require("axios");

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
            position:           position,
            imageUrl:           this.arenaInfos.differenceGameUrl,
            colorToIgnore:      WHITE,
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
        this.arenaInfos.users.forEach((user: User) => {
            this.players.push(new Player(user));
        });
    }

    public getPlayers(): Player[] {
        return this.players;
    }

}
