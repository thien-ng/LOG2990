import { injectable } from "inversify";
import { Highscore, Mode } from "../../../common/communication/highscore";

const REMOVE_NOTHING: number = 0;

@injectable()
export class HighscoreService {
    private highscores: Highscore[] = [];

    // TBD Will be called when new card is created ( no change request for this one lol )
    // public generateNewHighscore(id: number): void {

    // }

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
