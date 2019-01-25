import "reflect-metadata";

import { expect } from "chai";
import { CardModel } from "../../../common/communication/cardModel";
import { CardManagerService } from "./card-manager.service";

const TWO: number = 2;
const FOUR: number = 4;
const SIX: number = 6;

describe("Card-manager tests", () => {
    const cards1: CardManagerService = new CardManagerService();

    const cm: CardModel[][] = [
    [
        {
            gameID: 1,
            title: "Default 2D",
            subtitle: "default 2D",
            avatarImageUrl: "http://lebaneezgirl11.l.e.pic.centerblog.net/sch1p9t8.jpg",
            gameImageUrl: "http://lebaneezgirl11.l.e.pic.centerblog.net/sch1p9t8.jpg",
            highscore: {
                timesSingle: [TWO, FOUR, SIX],
                timesMulti: [TWO, FOUR, SIX],
            },
        },
    ],
    [
        {
            gameID: 2,
            title: "Default 3D",
            subtitle: "default 3D",
            avatarImageUrl: "http://www.humour-canin.com/images/canin/wallpapers/real_3015_husky.jpg",
            gameImageUrl: "http://www.humour-canin.com/images/canin/wallpapers/real_3015_husky.jpg",
            highscore: {
                timesSingle: [TWO, FOUR, SIX],
                timesMulti: [TWO, FOUR, SIX],
            },
        },
    ],
    ];

    it("Should return the card in the list", () => {
        expect(cards1.getCards()[0][0]).deep.equal(cm[0][0]);
    });
    it("Should return the 2nd card in the list", () => {
        expect(cards1.getCards()[1][0]).deep.equal(cm[1][0]);
    });
    it("should return the list of 1 element", () => {
        expect(cards1.getCards()).deep.equal(cm);
    });
});
