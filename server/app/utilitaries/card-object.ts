// import { injectable } from "inversify";
import { CardModel } from "../../../common/communication/cardModel";
import { Highscore, Mode } from "../../../common/communication/highscore";

// @injectable()
export class CardObject {
    private _highscoreSingle: Highscore;
    private _highscoreMulti: Highscore;
    private _cardModel: CardModel;

    public constructor(highscoreSingle: Highscore, highscoreMulti: Highscore, cardModel: CardModel) {
        this._highscoreSingle = highscoreSingle;
        this._highscoreSingle = highscoreMulti;
        this._cardModel = cardModel;
    }

    public get highscoreSingle(): Highscore {
        return this._highscoreSingle;
    }

    public get cardModel(): CardModel {
        return this._cardModel;
    }

    public updateHighscore(value: number, mode: Mode): void {
        switch (mode) {
            case Mode.Singleplayer:
                this.checkScore(value, this._highscoreSingle);
                break;
            case Mode.Multiplayer:
                this.checkScore(value, this._highscoreMulti);
                break;
            default:
                break;
        }
    }

    private checkScore(value: number, highscore: Highscore): void {
        let hasBeenReplaced: Boolean = false;
        highscore.times.forEach((element: number) => {
            if (element > value && !hasBeenReplaced) {
                highscore.times.splice(highscore.times.indexOf(element), 0, value);
                highscore.times.pop();
                hasBeenReplaced = true;
            }
        });

    }
}
