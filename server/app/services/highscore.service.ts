import { AxiosInstance, AxiosResponse } from "axios";
import { injectable } from "inversify";
import {
    Highscore,
    HighscoreMessage,
    HighscoreValidationMessage,
    HighscoreValidationStatus,
    Mode,
    Time,
    TimeMessage
} from "../../../common/communication/highscore";
import { CCommon } from "../../../common/constantes/cCommon";
import { Constants } from "../constants";

const DEFAULT_NUMBER:       number = 0;
const MAX_TIME:             number = 600;
const MIN_TIME:             number = 180;
const DOESNT_EXIST:         number = -1;
const SECONDS_IN_MINUTES:   number = 60;
const BASE_DECIMAL:         number = 10;
const NAME:                 string = "ordinateur";
const axios:                AxiosInstance = require("axios");

@injectable()
export class HighscoreService {
    private highscores: Highscore[] = [];

    public createHighscore(id: number): void {
        let i: number = 1;
        const highscore: Highscore = {
            id:             id,
            timesSingle:    [
                this.generateDefaultTime(NAME + i++),
                this.generateDefaultTime(NAME + i++),
                this.generateDefaultTime(NAME + i++),
            ],
            timesMulti:     [
                this.generateDefaultTime(NAME + i++),
                this.generateDefaultTime(NAME + i++),
                this.generateDefaultTime(NAME + i++),
            ],
        };
        this.highscores.push(highscore);
        this.generateNewHighscore(id);
    }

    private formatZeroDecimal(value: number): string {
        return (value < BASE_DECIMAL) ? "0" : "";
    }

    public convertToString(id: number): HighscoreMessage {
        const index: number = this.findHighScoreByID(id);

        return {
            id:             id,
            timesSingle:    this.secondsToMinutes(this.highscores[index].timesSingle),
            timesMulti:     this.secondsToMinutes(this.highscores[index].timesMulti),
        };
    }

    private secondsToMinutes(times: [Time, Time, Time]): [TimeMessage, TimeMessage, TimeMessage] {
        const messageHighscore: [TimeMessage, TimeMessage, TimeMessage] = this.generateTimesMessage();
        let i: number = 0;

        times.forEach((element: Time) => {
            const minutes: string = Math.floor(element.time / SECONDS_IN_MINUTES).toString();
            const seconds: string = (element.time - parseFloat(minutes) * SECONDS_IN_MINUTES).toString();
            messageHighscore[i].username = element.username;
            messageHighscore[i++].time = minutes + ":" + this.formatZeroDecimal(parseFloat(seconds)) + seconds;
        });

        return messageHighscore;
    }

    private generateTimesMessage(): [TimeMessage, TimeMessage, TimeMessage] {
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

    public generateNewHighscore(id: number): void {
        const index: number = this.findHighScoreByID(id);
        let i: number = 0;
        this.setMaxValue(index);
        const randomSingleTimes: [number, number, number] = [DEFAULT_NUMBER, DEFAULT_NUMBER, DEFAULT_NUMBER];
        const randomMultiTimes: [number, number, number] = [DEFAULT_NUMBER, DEFAULT_NUMBER, DEFAULT_NUMBER];

        randomSingleTimes.forEach(() => {
            randomSingleTimes[i] = this.randomTime(MIN_TIME, MAX_TIME);
            randomMultiTimes[i++] = this.randomTime(MIN_TIME, MAX_TIME);
        });

        randomMultiTimes.sort();
        randomSingleTimes.sort();

        for (let j: number = 0; j < randomMultiTimes.length; j++) {
            this.highscores[index].timesSingle[j].time = randomSingleTimes[j];
            this.highscores[index].timesMulti[j].time = randomMultiTimes[j];
        }
    }

    private generateApiMessage(value: Time, highscore: Highscore, mode: Mode): HighscoreValidationMessage {
        return {
            newValue: value,
            mode: mode,
            times: highscore,
        };
    }

    private setMaxValue(index: number): void {
        let i: number = 1;
        this.highscores[index].timesSingle = [
            this.generateDefaultTime(NAME + i++),
            this.generateDefaultTime(NAME + i++),
            this.generateDefaultTime(NAME + i++),
        ];
        this.highscores[index].timesMulti   = [
            this.generateDefaultTime(NAME + i++),
            this.generateDefaultTime(NAME + i++),
            this.generateDefaultTime(NAME + i++),
        ];
    }

    public findHighScoreByID(id: number): number {
        let index: number = DOESNT_EXIST;

        this.highscores.forEach((highscore: Highscore) => {
            if (highscore.id === id) {
                index = this.highscores.indexOf(highscore);
            }
        });

        return index;
    }

    private async validateHighscore(message: HighscoreValidationMessage, index: number): Promise<HighscoreValidationResponse> {
        try {
            const response: HighscoreValidationResponse = (await axios.post(Constants.VALIDATE_HIGHSCORE_PATH, message)).data;
            if (response.status === CCommon.ON_SUCCESS && response.isNewHighscore) {
                this.highscores[index] = response.highscore;
            }

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
