import { injectable } from "inversify";
import { Highscore, HighscoreMessage, Mode } from "../../../common/communication/highscore";

const REMOVE_NOTHING:       number = 0;
const MAX_TIME:             number = 600;
const MIN_TIME:             number = 180;
const DOESNT_EXIST:         number = -1;
const SECONDS_IN_MINUTES:   number = 60;
const BASE_DECIMAL:         number = 10;
const MAX_NUMBER:           number = Number.MAX_SAFE_INTEGER;

@injectable()
export class HighscoreService {
    private highscores: Highscore[] = [];

    public createHighscore(id: number): void {
        const highscore: Highscore = {
            id:             id,
            timesSingle:    [MAX_TIME, MAX_TIME, MAX_TIME],
            timesMulti:     [MAX_TIME, MAX_TIME, MAX_TIME],
        };
        this.highscores.push(highscore);
        this.generateNewHighscore(id);
    }

    private formatZeroDecimal(value: number): string {
        return (value < BASE_DECIMAL) ? "0" : "";
    }

    public convertToString(id: number): HighscoreMessage {
        const message: HighscoreMessage = {
            id:             id,
            timesSingle:    ["", "", ""],
            timesMulti:     ["", "", ""],
        };
        const index: number = this.findHighScoreByID(id);
        message.timesMulti  = this.secondsToMinutes(this.highscores[index].timesMulti);
        message.timesSingle = this.secondsToMinutes(this.highscores[index].timesSingle);

        return message;
    }

    private secondsToMinutes(times: [number, number, number]): [string, string, string] {
        const messageHighscore: [string, string, string] = ["", "", ""];
        let i:                  number = 0;

        times.forEach((element: number) => {
            const minutes: string = Math.floor(element / SECONDS_IN_MINUTES).toString();
            const seconds: string = (element - parseFloat(minutes) * SECONDS_IN_MINUTES).toString();
            messageHighscore[i++] = minutes + ":" + this.formatZeroDecimal(parseFloat(seconds)) + seconds;
        });

        return messageHighscore;
    }

    public generateNewHighscore(id: number): void {
        const index: number = this.findHighScoreByID(id);
        this.setMaxValue(index);
        this.highscores[index].timesMulti.forEach(() => {
            this.checkScore(this.randomTime(MIN_TIME, MAX_TIME), this.highscores[index].timesMulti);
            this.checkScore(this.randomTime(MIN_TIME, MAX_TIME), this.highscores[index].timesSingle);
        });
    }

    private setMaxValue(index: number): void {
        this.highscores[index].timesMulti = [MAX_NUMBER, MAX_NUMBER, MAX_NUMBER];
        this.highscores[index].timesSingle = [MAX_NUMBER, MAX_NUMBER, MAX_NUMBER];
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

    public updateHighscore(value: number, mode: Mode, cardID: number): void {
        const highscore: Highscore = this.highscores[this.findHighScoreByID(cardID)];
        if (highscore !== undefined) {
            switch (mode) {
                case Mode.Singleplayer:
                    this.checkScore(value, highscore.timesSingle);
                    break;
                case Mode.Multiplayer:
                    this.checkScore(value, highscore.timesMulti);
                    break;
                default:
                    // Fails quietly
                    break;
            }
        }
    }

    private checkScore(value: number, times: [number, number, number]): void {
        let hasBeenReplaced: Boolean = false;
        times.forEach((element: number) => {
            if (element > value && !hasBeenReplaced) {
                times.splice(times.indexOf(element), REMOVE_NOTHING, value);
                times.pop();
                hasBeenReplaced = true;
            }
        });

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
