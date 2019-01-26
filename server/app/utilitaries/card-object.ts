import { CardModel } from "../../../common/communication/cardModel";

export class CardObject {
    private _cardModel: CardModel;

    public constructor(cardModel: CardModel) {
        this._cardModel = cardModel;
    }

    public get cardModel(): CardModel {
        return this._cardModel;
    }
}
