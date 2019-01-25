// import { injectable } from "inversify";
import { CardModel } from "../../../common/communication/cardModel";
import { Mode } from "../../../common/communication/highscore";

// @injectable()
export class CardObject {
    private _cardModel: CardModel;

    public constructor(cardModel: CardModel) {
        this._cardModel = cardModel;
    }

    public get highscoreSingle(): number[] {
        return this._cardModel.highscore.timesSingle;
    }

    public get highscoreMulti(): number[] {
        return this._cardModel.highscore.timesMulti;
    }

    public get cardModel(): CardModel {
        return this._cardModel;
    }

    public updateHighscore(value: number, mode: Mode): void {
        switch (mode) {
            case Mode.Singleplayer:
                this.checkScore(value, this._cardModel.highscore.timesSingle);
                break;
            case Mode.Multiplayer:
                this.checkScore(value, this._cardModel.highscore.timesMulti);
                break;
            default:
                break;
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
}
