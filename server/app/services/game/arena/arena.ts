import { AxiosInstance, AxiosResponse } from "axios";
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
    IPlayerInput,
} from "./interfaces";
import { Referee } from "./referee";
import { Timer } from "./timer";

const axios: AxiosInstance = require("axios");

export class Arena {

    private readonly ERROR_ON_HTTPGET:      string = "Didn't succeed to get image buffer from URL given. File: arena.ts.";
    private readonly ON_FAILED_CLICK:       string = "onFailedClick";
    private readonly ON_PLAYER_CLICK:       string = "onClick";

    private players:                Player[];
    public  timer:                  Timer;
    private referee:                Referee;
    private originalElements:       Map<number, IOriginalPixelCluster>; // A BOUGER DANS LES ARENA 2D et 3D

    public constructor(
        private arenaInfos: IArenaInfos,
        @inject(Types.GameManagerService) public gameManagerService: GameManagerService) {
        this.players = [];
        this.createPlayers();
        this.originalElements = new Map<number, IOriginalPixelCluster>();
        this.timer = new Timer();
    }

    public async validateHit(position: IPosition2D): Promise<IHitConfirmation> {
        return this.referee.validateHit(position);
    }

    public async onPlayerInput(playerInput: IPlayerInput): Promise<IPlayerInputResponse> {

        let response: IPlayerInputResponse = this.buildPlayerInputResponse(
            this.ON_FAILED_CLICK,
            Constants.ON_ERROR_PIXEL_CLUSTER,
        );

        switch (playerInput.event) {
            case this.ON_PLAYER_CLICK:
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
        return this.referee.onPlayerClick(position, user);
    }

    private buildPlayerInputResponse(status: string, response: IOriginalPixelCluster): IPlayerInputResponse {
        return {
            status: status,
            response: response,
        };
    }

    public async prepareArenaForGameplay(): Promise<void> {
        await this.extractOriginalPixelClusters();
        this.referee = new Referee(this, this.players, this.originalElements, this.timer, this.arenaInfos);
    }

    private async extractOriginalPixelClusters(): Promise<void> {
        const originalImage:    Buffer                  = await this.getImageFromUrl(this.arenaInfos.originalGameUrl);
        const differenceImage:  Buffer                  = await this.getImageFromUrl(this.arenaInfos.differenceGameUrl);
        const extractor:        DifferencesExtractor    = new DifferencesExtractor();
        this.originalElements = extractor.extractPixelClustersFrom(originalImage, differenceImage);
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

    private createPlayers(): void {
        this.arenaInfos.users.forEach((user: IUser) => {
            this.players.push(new Player(user));
        });
    }

    public getPlayers(): Player[] {
        return this.players;
    }

    public sendMessage(playerSocketId: string, event: string, message: number): void {
        this.gameManagerService.sendMessage(playerSocketId, event, message);
    }
}
