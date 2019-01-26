import { injectable } from "inversify";
import { Highscore, Mode } from "../../../common/communication/highscore";

@injectable()
export class CardManagerService {
    private _highscores: Highscore[];

    private findHighscore(id: number): Highscore | undefined {
        let score: Highscore | undefined;
        this._highscores.forEach((element: Highscore) => {
            if (element.id === id) {
                score = element;
            }
        });

        return score;
    }

    public updateHighscore(value: number, mode: Mode, cardID: number): void {
        const highscore: Highscore | undefined = this.findHighscore(cardID);
        if (highscore !== undefined) {
            switch (mode) {
                case Mode.Singleplayer:
                    this.checkScore(value, highscore.timesSingle);
                    break;
                case Mode.Multiplayer:
                    this.checkScore(value, highscore.timesMulti);
                    break;
                default:
                    break;
            }
        }
    }

    private checkScore(value: number, times: number[]): void {
        let hasBeenReplaced: Boolean = false;
        times.forEach((element: number) => {
            if (element > value && !hasBeenReplaced) {
                times.splice(times.indexOf(element), 0, value);
                times.pop();
                hasBeenReplaced = true;
            }
        });

    }

    public get highscoreSingle(): number[] {
        return this._cardModel.highscore.timesSingle;
    }

    public get highscoreMulti(): number[] {
        return this._cardModel.highscore.timesMulti;
    }

}
