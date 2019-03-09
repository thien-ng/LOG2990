import { AxiosInstance, AxiosResponse } from "axios";
import { injectable } from "inversify";
import { Highscore, HighscoreMessage, HighscoreValidationMessage, Mode, Time, TimeMessage } from "../../../common/communication/highscore";
import { Constants } from "../constants";

const DEFAULT_NUMBER:       number = 0;
const REMOVE_NOTHING:       number = 0;
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

    private generateApiMessage(value: Time, timeList: [Time, Time, Time]): HighscoreValidationMessage {
        return {
            newValue: value,
            times: timeList,
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

    public randomTime(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public getHighscoreById(id: number): Highscore | undefined {
        let score: Highscore | undefined;

        this.highscores.forEach((element: Highscore) => {
            if (element.id === id) {
                score = element;
            }
        });

        return score;
    }

    public async updateHighscore(value: Time, mode: Mode, cardID: number): Promise<Highscore> {
        const highscore: Highscore = this.highscores[this.findHighScoreByID(cardID)];

        if (highscore !== undefined) {
            switch (mode) {
                case Mode.Singleplayer:
                    const messageSingle: HighscoreValidationMessage = this.generateApiMessage(value, highscore.timesSingle);
                    highscore.timesSingle = await this.validateHighscore(messageSingle, highscore, mode);
                    break;
                case Mode.Multiplayer:
                    const messageMulti: HighscoreValidationMessage = this.generateApiMessage(value, highscore.timesMulti);
                    highscore.timesMulti = await this.validateHighscore(messageMulti, highscore, mode);
                    break;
                default:
                    // Fails quietly
                    break;
            }
        }

        return highscore;
    }

    private async validateHighscore(message: HighscoreValidationMessage, highscore: Highscore, mode: Mode): Promise<[Time, Time, Time]> {
        return axios.post(Constants.VALIDATE_HIGHSCORE_PATH, message)
        .then((response: AxiosResponse) => {
            return response.data;
        }).catch((error: Error) => {throw new TypeError(error.message); });
    }

    private generateDefaultTime(name: string): Time {
        return {
            username: name,
            time: MAX_TIME,
        };
    }

    // Methods for testing
    public addHighscore(hs: Highscore[]): void {
        this.highscores.splice(REMOVE_NOTHING, this.highscores.length);
        this.highscores = hs;
    }

    public get allHighscores(): Highscore[] {
        return this.highscores;
    }
}
