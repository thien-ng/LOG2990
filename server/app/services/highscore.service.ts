import { AxiosInstance } from "axios";
import { injectable } from "inversify";
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
import { AssetManagerService } from "./asset-manager.service";

const ERROR:                number = -1;
const DEFAULT_NUMBER:       number = 0;
const MAX_TIME:             number = 600;
const MIN_TIME:             number = 180;
const SECONDS_IN_MINUTES:   number = 60;
const BASE_DECIMAL:         number = 10;
const NAME:                 string = "ordinateur";
const axios:                AxiosInstance = require("axios");

@injectable()
export class HighscoreService {
    private socketServer: SocketIO.Server;
    private assetManager: AssetManagerService;

    public constructor() {
        this.assetManager = new AssetManagerService();
    }

    public setServer(server: SocketIO.Server): void {
        this.socketServer = server;
    }

    public convertToString(id: number): HighscoreMessage {

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

        const foundHighscore: Highscore = {
            id: id,
        } as Highscore;
        this.setMaxValue(foundHighscore);

        const randomSingleTimes: [number, number, number] = [DEFAULT_NUMBER, DEFAULT_NUMBER, DEFAULT_NUMBER];
        const randomMultiTimes: [number, number, number] = [DEFAULT_NUMBER, DEFAULT_NUMBER, DEFAULT_NUMBER];

        for (let i: number = 0; i < randomSingleTimes.length; i++) {
            randomSingleTimes[i] = this.randomTime(MIN_TIME, MAX_TIME);
            randomMultiTimes[i] = this.randomTime(MIN_TIME, MAX_TIME);
        }

        randomMultiTimes.sort();
        randomSingleTimes.sort();

        for (let j: number = 0; j < randomMultiTimes.length; j++) {
            foundHighscore.timesSingle[j].time = randomSingleTimes[j];
            foundHighscore.timesMulti[j].time  = randomMultiTimes[j];
        }

        if (this.socketServer) {
            this.socketServer.emit(CCommon.ON_NEW_SCORE, id);
        }
        this.assetManager.saveHighscore(foundHighscore);
    }

    public randomTime(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public async updateHighscore(value: Time, mode: Mode, gameID: number): Promise<HighscoreValidationResponse> {
        const foundHighscore: Highscore = this.assetManager.getHighscoreById(gameID);

        if (foundHighscore) {
            switch (mode) {
                case Mode.Singleplayer:
                    const messageSingle: HighscoreValidationMessage = this.generateApiMessage(value, foundHighscore, mode);

                    return this.validateHighscore(messageSingle, foundHighscore);
                case Mode.Multiplayer:
                    const messageMulti: HighscoreValidationMessage = this.generateApiMessage(value, foundHighscore, mode);

                    return this.validateHighscore(messageMulti, foundHighscore);
                default:
                    break;
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

    private setMaxValue(highscore: Highscore): void {
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
