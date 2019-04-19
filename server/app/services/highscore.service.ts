import { AxiosInstance } from "axios";
import { inject, injectable } from "inversify";
import {
    Highscore,
    HighscoreMessage,
    HighscoreValidationMessage,
    HighscoreValidationResponse,
    Mode,
    StringFormatedTime,
    Time
} from "../../../common/communication/highscore";
import { CCommon } from "../../../common/constantes/cCommon";
import { CServer } from "../CServer";
import types from "../types";
import { AssetManagerService } from "./asset-manager.service";

const ERROR:                number = -1;
const DEFAULT_NUMBER:       number = 0;
const MAX_TIME:             number = 600;
const MIN_TIME:             number = 180;
const SECONDS_IN_MINUTES:   number = 60;
const BASE_DECIMAL:         number = 10;
const NAME:                 string = "ordinateur";
const axios:                AxiosInstance = require("axios");
const WRONG_MODE_MESSAGE:   string = "Wrong type of game mode.";

@injectable()
export class HighscoreService {
    private socketServer: SocketIO.Server;
    private newHighscore: Highscore;

    public constructor(@inject(types.AssetManagerService) private assetManager: AssetManagerService) {}

    public setServer(server: SocketIO.Server): void {
        this.socketServer = server;
    }

    public getHighscoreById(id: number): HighscoreMessage {

        const foundHighscore: Highscore = this.assetManager.getHighscoreById(id);
        if (foundHighscore) {
            return {
                id:             id,
                timesSingle:    this.secondsToMinutes(foundHighscore.timesSingle),
                timesMulti:     this.secondsToMinutes(foundHighscore.timesMulti),
            } as HighscoreMessage;
        }

        return {
            id: ERROR,
        } as HighscoreMessage;
    }

    public generateNewHighscore(id: number): void {

        this.newHighscore = {
            id: id,
        } as Highscore;
        this.setMaxHighscoreValue(this.newHighscore);

        const randomSingleTimes: [number, number, number] = [DEFAULT_NUMBER, DEFAULT_NUMBER, DEFAULT_NUMBER];
        const randomMultiTimes: [number, number, number] = [DEFAULT_NUMBER, DEFAULT_NUMBER, DEFAULT_NUMBER];

        for (let i: number = 0; i < randomSingleTimes.length; i++) {
            randomSingleTimes[i] = this.randomTime(MIN_TIME, MAX_TIME);
            randomMultiTimes[i] = this.randomTime(MIN_TIME, MAX_TIME);
        }

        randomMultiTimes.sort();
        randomSingleTimes.sort();

        for (let j: number = 0; j < randomMultiTimes.length; j++) {
            this.newHighscore.timesSingle[j].time = randomSingleTimes[j];
            this.newHighscore.timesMulti[j].time  = randomMultiTimes[j];
        }

        if (this.socketServer) {
            this.socketServer.emit(CCommon.ON_NEW_SCORE, id);
        }
        this.assetManager.saveHighscore(this.newHighscore);
    }

    public randomTime(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public async updateHighscore(value: Time, mode: Mode, gameID: number): Promise<HighscoreValidationResponse> {
        const foundHighscore: Highscore = this.assetManager.getHighscoreById(gameID);

        if (foundHighscore.id === -1) {
            return {status: CCommon.ON_ERROR} as HighscoreValidationResponse;
        } else if (foundHighscore) {
            switch (mode) {
                case Mode.Singleplayer:
                    const messageSingle: HighscoreValidationMessage = this.generateApiMessage(value, foundHighscore, mode);

                    return this.validateHighscore(messageSingle, foundHighscore);
                case Mode.Multiplayer:
                    const messageMulti: HighscoreValidationMessage = this.generateApiMessage(value, foundHighscore, mode);

                    return this.validateHighscore(messageMulti, foundHighscore);
                default:
                    throw new TypeError(WRONG_MODE_MESSAGE);
            }
        }

        return {
            status: CCommon.ON_ERROR,
        } as HighscoreValidationResponse;
    }

    private formatZeroDecimal(value: number): string {
        return (value < BASE_DECIMAL) ? "0" : "";
    }

    private secondsToMinutes(times: [Time, Time, Time]): [StringFormatedTime, StringFormatedTime, StringFormatedTime] {
        const messageHighscore: [StringFormatedTime, StringFormatedTime, StringFormatedTime] = this.generateTimesMessage();
        let i: number = 0;

        times.forEach((time: Time) => {
            const minutes: string = Math.floor(time.time / SECONDS_IN_MINUTES).toString();
            const seconds: string = (time.time - parseFloat(minutes) * SECONDS_IN_MINUTES).toString();
            messageHighscore[i].username = time.username;
            messageHighscore[i].time = minutes + ":" + this.formatZeroDecimal(parseFloat(seconds)) + seconds;
            i++;
        });

        return messageHighscore;
    }

    private generateTimesMessage(): [StringFormatedTime, StringFormatedTime, StringFormatedTime] {
        return [
            {
                username: "",
                time: "",
            },
            {
                username: "",
                time: "",
            },
            {
                username: "",
                time: "",
            },
        ];
    }

    private generateApiMessage(value: Time, highscore: Highscore, mode: Mode): HighscoreValidationMessage {
        return {
            newValue: value,
            mode: mode,
            times: highscore,
        } as HighscoreValidationMessage;
    }

    private setMaxHighscoreValue(highscore: Highscore): void {
        let i: number = 1;
        highscore.timesSingle = [
            this.generateDefaultTime(NAME + i++),
            this.generateDefaultTime(NAME + i++),
            this.generateDefaultTime(NAME + i++),
        ];
        highscore.timesMulti = [
            this.generateDefaultTime(NAME + i++),
            this.generateDefaultTime(NAME + i++),
            this.generateDefaultTime(NAME + i++),
        ];
    }

    private async validateHighscore(message: HighscoreValidationMessage, highscore: Highscore): Promise<HighscoreValidationResponse> {
        try {
            const response: HighscoreValidationResponse = (await axios.post(CServer.VALIDATE_HIGHSCORE_PATH, message)).data;
            if (response.status === CCommon.ON_SUCCESS && response.isNewHighscore) {
                highscore = response.highscore;
            }
            this.assetManager.saveHighscore(highscore);

            return response;
        } catch (error) {
            return {
                status: CCommon.ON_ERROR,
            } as HighscoreValidationResponse;
        }
    }

    private generateDefaultTime(name: string): Time {
        return {
            username: name,
            time: MAX_TIME,
        };
    }
}
