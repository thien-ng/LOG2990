import { injectable } from "inversify";
import { Highscore, HighscoreMessage, Mode } from "../../../common/communication/highscore";

const REMOVE_NOTHING: number = 0;
const MAX_TIME: number = 600;
const MIN_TIME: number = 180;
const DOESNT_EXIST: number = -1;
const SECONDS_IN_MINUTES: number = 60;

@injectable()
export class HighscoreService {
    private highscores: Highscore[] = [];

    public createHighscore(id: number): void {
        const highscore: Highscore = {
            id: id,
            timesSingle: [MAX_TIME, MAX_TIME, MAX_TIME],
            timesMulti: [MAX_TIME, MAX_TIME, MAX_TIME],
        };
        this.highscores.push(highscore);
        this.generateNewHighscore(id);
    }

    public convertToString(id: number): HighscoreMessage {
        const message: HighscoreMessage = {
            id: id,
            timeSingle: ["", "", ""],
            timesMulti: ["", "", ""],
        };
        const index: number = this.findHighScoreID(id);
        let i: number = 0;
        this.highscores[index].timesMulti.forEach((element: number) => {
            const minutes: string = Math.floor(element / SECONDS_IN_MINUTES).toString();
            const seconds: string = (element - parseFloat(minutes) * SECONDS_IN_MINUTES).toString();
            message.timesMulti[i++] = minutes + ":" + seconds;
        });
        i = 0;
        this.highscores[index].timesSingle.forEach((element: number) => {
            const minutes: string = Math.floor(element / SECONDS_IN_MINUTES).toString();
            const seconds: string = (element - parseFloat(minutes) * SECONDS_IN_MINUTES).toString();
            message.timeSingle[i++] = minutes + ":" + seconds;
        });

        return message;
    }

    public generateNewHighscore(id: number): void {
        const index: number = this.findHighScoreID(id);
        this.highscores[index].timesMulti.forEach(() => {
            this.checkScore(this.randomTime(MIN_TIME, MAX_TIME), this.highscores[index].timesMulti);
            this.checkScore(this.randomTime(MIN_TIME, MAX_TIME), this.highscores[index].timesSingle);
        });
    }

    public findHighScoreID(id: number): number {
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
    public get highscore(): Highscore[] {
        return this.highscores;
    }

    public updateHighscore(value: number, mode: Mode, cardID: number): void {
        const highscore: Highscore | undefined = this.getHighscoreById(cardID);
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

    private checkScore(value: number, times: number[]): void {
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
}
