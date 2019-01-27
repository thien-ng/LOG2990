import { expect } from "chai";
import { CardModel, GameMode } from "../../../common/communication/cardModel";
import { CardObject } from "./card-object";

describe("CardObject tests", () => {
    const cm: CardModel = {
        gameID: 1,
        title: "string",
        subtitle: "string",
        avatarImageUrl: "string",
        gameImageUrl: "string",
        gamemode: GameMode.twoD,
    };
    const card: CardObject = new CardObject(cm);

    it("Should return the card model", () => {
        expect(card.cardModel).to.equal(cm);
    });
});
