import "reflect-metadata";

import { expect } from "chai";
import { CardModel } from "../../../common/communication/cardModel";
import { CardObject } from "../utilitaries/card-object";
import { CardManagerService } from "./card-manager.service";

const TWO: number = 2;
const THREE: number = 3;

describe("Card-manager tests", () => {
    const cards1: CardManagerService = new CardManagerService();

    const cm1: CardModel = {
        gameID: 1,
        title: "Default 2D",
        subtitle: "default 2D",
        avatarImageUrl: "../asset/image/elon.jpg",
        gameImageUrl: "../asset/image/elon.jpg",
        is2D: true,
    };

    const cm2: CardModel = {
        gameID: 2,
        title: "Default 3D",
        subtitle: "default 3D",
        avatarImageUrl: "../asset/image/moutain.jpg",
        gameImageUrl: "../asset/image/moutain.jpg",
        is2D: false,
    };

    const cm3: CardModel = {
        gameID: 3,
        title: "Default 3D",
        subtitle: "default 3D",
        avatarImageUrl: "../asset/image/poly.jpg",
        gameImageUrl: "../asset/image/poly.jpg",
        is2D: false,
    };

    const cm: CardModel[][] = [
    [
        cm1,
    ],
    [
        cm2,
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
    it("should return false when adding an existing card", () => {
        expect(cards1.addCard(new CardObject(cm1))).to.equal(false);
    });
    it("should return true when adding a new card", () => {
        expect(cards1.addCard(new CardObject(cm3))).to.equal(true);
    });
    it("should return new length of 3D list after adding a card", () => {
        expect(cards1.getCards()[1].length).to.equal(TWO);
    });
    it("should return the newly added card", () => {
        expect(cards1.getCards()[1][1]).deep.equal(cm3);
    });
    it("should remove the newly added card", () => {
        expect(cards1.removeCard(THREE)).to.equal(true);
    });
    it("should return undefined because there is no more card there", () => {
        expect(cards1.getCards()[1][1]).deep.equal(undefined);
    });
});
