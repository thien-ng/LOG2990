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
    const hsM: Highscore = {
        mode: Mode.Multiplayer,
        times: [TWO, FOUR, SIX],
    };
    const hsS: Highscore = {
        mode: Mode.Singleplayer,
        times: [TWO, FOUR, SIX],
    };
    const cm: CardModel = {
        gameID: 1,
        title: "string",
        subtitle: "string",
        avatarImageUrl: "string",
        gameImageUrl: "string",
    };
    const card: CardObject = new CardObject(hsS, hsM, cm);

    it("Should replace the second place to three", () => {
        card.updateHighscore(THREE, Mode.Singleplayer);
        expect(card.highscoreSingle.times[ONE]).to.equal(THREE);
    });
});
