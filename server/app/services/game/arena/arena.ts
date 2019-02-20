import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { User } from "../../../../../common/communication/iUser";
import { Constants } from "../../../constants";
import { DifferencesExtractor } from "./differencesExtractor";
import {
    IArenaInfos,
    IHitConfirmation,
    IHitToValidate,
    IOriginalImageSegment,
    IPlayerInput,
    IPlayerInputReponse,
    IPosition2D,
} from "./interfaces";
import { Player } from "./player";
// import { Timer } from "./timer";

const FF: number = 255;
const WHITE: number[] = [FF, FF, FF];
const URL_HIT_VALIDATOR: string = "http://localhost:3000/api/hitvalidator";

export class Arena {

    private readonly ERROR_ON_HTTPGET: string = "Didn't succeed to get image buffer from URL given. File: arena.ts.";
    private readonly ERROR_HIT_VALIDATION: string = "Problem during Hit Validation process.";
    private readonly ERROR_UNDEFINED_USER_EVENT: string = "Undefined player event";

    private readonly ON_FAILED_CLICK: string = "onFailedClick";
    private readonly USER_WRONG_CLICK: string = "Le pixel cliqué n'est pas une différence";
    private readonly USER_EVENT: string = "onClick";
    private _players: Player[];
    private originalImageSegments: IOriginalImageSegment[];

    public constructor(private arenaInfos: IArenaInfos) {
        this._players = [];
        this.createPlayers();
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

    public async onPlayerInput(playerInput: IPlayerInput): Promise<IPlayerInputReponse> {
        switch (playerInput.event) {
            case this.USER_EVENT:
                return this.onPlayerClick(playerInput.position, playerInput.user);
                break;
            default:
                return {
                    status: Constants.ON_ERROR_MESSAGE,
                    response: this.ERROR_UNDEFINED_USER_EVENT,
                };
                break;
        }
    }

    public contains(user: User): boolean {
        return this._players.some((player: Player) => {
            return player.username === user.username;
        });
    }

    private async onPlayerClick(position: IPosition2D, user: User): Promise<IPlayerInputReponse> {
        const numberOfErrorsFound: number = this.originalImageSegments.length;

        return this.validateHit(position)
        .then((hitConfirmation: IHitConfirmation) => {
            if (hitConfirmation.isAHit) {
                this.buildPlayerInputResponse(
                    Constants.ON_SUCCESS_MESSAGE,
                    this.originalImageSegments[(numberOfErrorsFound - 1) - hitConfirmation.hitPixelColor[0]],
                );
            }

            return this.buildPlayerInputResponse(this.ON_FAILED_CLICK, this.USER_WRONG_CLICK);
        })
        .catch ((error: Error) => {
            return this.buildPlayerInputResponse(Constants.ON_ERROR_MESSAGE, error.message);
        });
    }

    private buildPlayerInputResponse(status: string, response: string | IOriginalImageSegment): IPlayerInputReponse {
        return {
            status: status,
            response: response,
        };
    }

    public async prepareArenaForGameplay(): Promise<void> {
        await this.extractOriginalImageSegments();
    }

    private async extractOriginalImageSegments(): Promise<void> {

        const originalImage:   Buffer = await this.getImageFromUrl(this.arenaInfos.originalGameUrl);
        const differenceImage: Buffer = await this.getImageFromUrl(this.arenaInfos.differenceGameUrl);
        const extractor: DifferencesExtractor = new DifferencesExtractor();
        this.originalImageSegments = extractor.extractDifferences(originalImage, differenceImage);
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

    private createPlayers(): void {
        this.arenaInfos.users.forEach((user: User) => {
            this._players.push(new Player(user));
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

    public getPlayers(): Player[] {
        return this._players;
    }

}
