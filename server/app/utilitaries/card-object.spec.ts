import { expect } from "chai";
import { CardModel } from "../../../common/communication/cardModel";
import { Highscore, Mode } from "../../../common/communication/highscore";
import { CardObject } from "./card-object";

const ONE: number = 1;
const TWO: number = 2;
const THREE: number = 3;
const FOUR: number = 4;
// const FIVE: number = 5;
const SIX: number = 6;
// const SEVEN: number = 7;

describe("CardObject tests", () => {
    const hs: Highscore = {
        timesSingle: [TWO, FOUR, SIX],
        timesMulti: [TWO, FOUR, SIX],
    };
    const cm: CardModel = {
        gameID: 1,
        title: "string",
        subtitle: "string",
        avatarImageUrl: "string",
        gameImageUrl: "string",
        highscore: hs,
    };
    const card: CardObject = new CardObject(cm);

    it("Should replace the second place to three", () => {
        card.updateHighscore(THREE, Mode.Singleplayer);
        expect(card.highscoreSingle[ONE]).to.equal(THREE);
    });
});
