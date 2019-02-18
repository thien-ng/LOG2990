import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { User } from "../../../../../common/communication/iUser";
import { DifferencesExtractor } from "./differencesExtractor";
import { IArenaInfos, IHitConfirmation, IHitToValidate, IOriginalImageSegment } from "./interfaces";
import { Player } from "./player";
// import { Timer } from "./timer";

const FF: number = 255;
const WHITE: number[] = [FF, FF, FF];
const URL_HIT_VALIDATOR: string = "http://localhost:3000/api/hitvalidator";

export class Arena {

    private readonly ERROR_ON_HTTPGET: string = "Didn't succeed to get image buffer from URL given. File: arena.ts.";

    private _players: Player[];
    private originalImageSegments: IOriginalImageSegment[];

    public constructor(private arenaInfos: IArenaInfos) {
        this.createPlayers();
    }

    public async prepareArenaForGameplay(): Promise<void> {
        await this.extractOriginalImageSegments();
        // set timer
        console.log("Lenght du array d'images : " + this.originalImageSegments.length);

        this.originalImageSegments.forEach((image: IOriginalImageSegment, index: number) => {
            console.log("\nImage #" + (index + 1));
            console.log("Start position : (" + image.startPosition.x + ", " + image.startPosition.y + ")");
            console.log("Width : " + image.width);
            console.log("Height : " + image.height);

        });
        // return this.originalImageSegments;
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

    private buildPostData(posX: number, posY: number): IHitToValidate {
        return {
            posX:               posX,
            posY:               posY,
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

    public async validateHit(posX: number, posY: number): Promise<IHitConfirmation> {

        const axios:        AxiosInstance       = require("axios");
        const postData:     IHitToValidate      = this.buildPostData(posX, posY);
        const postConfig:   AxiosRequestConfig  = this.buildPostConfig();

        return axios.post(URL_HIT_VALIDATOR, postData, postConfig)
            .then((res: AxiosResponse) => {
                return res.data;
            })
            .catch((err: AxiosError) => {
                throw new TypeError("Problem during Hit Validation process.");
            });
    }

    public getPlayers(): Player[] {
        return this._players;
    }

}
