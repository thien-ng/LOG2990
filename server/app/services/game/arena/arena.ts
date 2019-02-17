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
