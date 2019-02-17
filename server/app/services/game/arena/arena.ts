import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { User } from "../../../../../common/communication/iUser";
import { IArenaInfos, IHitConfirmation, IHitToValidate } from "./interfaces";
import { Player } from "./player";
// import { Timer } from "./timer";

const FF: number = 255;
const WHITE: number[] = [FF, FF, FF];
const URL_HIT_VALIDATOR: string = "http://localhost:3000/api/hitvalidator";

export class Arena {

    private _players: Player[];

    public constructor(private arenaInfos: IArenaInfos) {
        this.createPlayers();
    }

    // public async getAnswer(posX: number, posY: number): Promise<IHitConfirmation> {
    //     // tslint:disable-next-line:no-magic-numbers
    //     return (this.playerClickHandler(posX, posY));
    //     // console.log(reponse);

    //     // return reponse;

    // }

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

    public async playerClickHandler(posX: number, posY: number): Promise<IHitConfirmation> {

        const axios:        AxiosInstance       = require("axios");
        const postData:     IHitToValidate      = this.buildPostData(posX, posY);
        const postConfig:   AxiosRequestConfig  = this.buildPostConfig();

        return axios.post(URL_HIT_VALIDATOR, postData, postConfig)
            .then((res: AxiosResponse) => {
                // console.log("RESPONSE RECEIVED: ", res.data);

                return res.data;
            })
            .catch((err: AxiosError) => {
                // console.log("AXIOS ERROR: ", err);
            });
    }

    public getPlayers(): Player[] {
        return this._players;
    }

}
// const aInfos: IArenaInfos = {
//     arenaId:            1234,
//     users:              [],
//     originalGameUrl:    "http://localhost:3000/image/1_original.bmp",
//     differenceGameUrl:  "http://localhost:3000/image/1_generated.bmp",
// };

// const arena: Arena = new Arena(aInfos);
// const confirm: Promise<IHitConfirmation> = arena.getAnswer(367, 163);
// console.log("CONFIRM : " + confirm);
