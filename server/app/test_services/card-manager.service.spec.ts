import "reflect-metadata";

import { expect } from "chai";
import * as fs from "fs";
import * as path from "path";
import { DefaultCard2D, DefaultCard3D, GameMode, ICard } from "../../../common/communication/iCard";
import { ICardLists } from "../../../common/communication/iCardLists";
import { Message } from "../../../common/communication/message";
import { Constants } from "../constants";
import { CardManagerService } from "../services/card-manager.service";
import { HighscoreService } from "../services/highscore.service";

/*tslint:disable no-magic-numbers no-any */

const mockAdapter: any = require("axios-mock-adapter");
const axios: any = require("axios");
const mock: any = new mockAdapter(axios);
const CARD_NOT_FOUND: string = "Erreur de suppression, carte pas trouvée";
const FAKE_PATH: string = Constants.BASE_URL + "/image";
let cardManagerService: CardManagerService;
let highscoreService: HighscoreService;

describe("Card-manager tests", () => {

    const testImageOg: Buffer = fs.readFileSync(path.resolve(__dirname, "../asset/image/testBitmap/imagetestOg.bmp"));

    const c1: ICard = {
        gameID: 4,
        title: "Default 2D",
        subtitle: "default 2D",
        avatarImageUrl: FAKE_PATH + "/elon.jpg",
        gameImageUrl: FAKE_PATH + "/elon.jpg",
        gamemode: GameMode.simple,
    };

    const c2: ICard = {
        gameID: 2,
        title: "Default 3D",
        subtitle: "default 3D",
        avatarImageUrl: FAKE_PATH + "/moutain.jpg",
        gameImageUrl: FAKE_PATH + "/moutain.jpg",
        gamemode: GameMode.free,
    };

    const c3: ICard = {
        gameID: 3,
        title: "Default 3D 2.0",
        subtitle: "default 3D",
        avatarImageUrl: FAKE_PATH + "/poly.jpg",
        gameImageUrl: FAKE_PATH + "/poly.jpg",
        gamemode: GameMode.free,
    };
    const cards: ICardLists = {
        list2D: [DefaultCard2D],
        list3D: [DefaultCard3D],
    };

    beforeEach(() => {
        highscoreService = new HighscoreService();
        cardManagerService = new CardManagerService(highscoreService);
    });

    it("should return the list of all cards", () => {
        expect(cardManagerService.getCards()).deep.equal(cards);
    });

    it("should return true when adding a new 2D card", () => {
        expect(cardManagerService.addCard2D(c1)).to.equal(true);
    });

    it("should return true when adding a new 3D card", () => {
        expect(cardManagerService.addCard3D(c2)).to.equal(true);
    });

    it("should return false when adding an existing 3D card", () => {
        cardManagerService.addCard3D(c2);
        expect(cardManagerService.addCard3D(c2)).to.equal(false);
    });

    it("should return new length of 3D list after adding a card", () => {
        cardManagerService.addCard3D(c2);
        cardManagerService.addCard3D(c3);
        expect(cardManagerService.getCards().list3D.length).to.equal(3);
    });

    it("should return the newly added card", () => {
        cardManagerService.addCard3D(c3);
        expect(cardManagerService.getCards().list3D[0]).deep.equal(c3);
    });

    it("should return an error while deleting the default 2D card", () => {
        expect(cardManagerService.removeCard2D(1)).deep.equal(Constants.DELETION_ERROR_MESSAGE);
    });

    it("should return an error while deleting the default 3D card", () => {
        expect(cardManagerService.removeCard3D(1)).deep.equal(Constants.DELETION_ERROR_MESSAGE);
    });

    it("should return false because the card doesnt exist", () => {
        expect(cardManagerService.removeCard2D(0)).to.equal(CARD_NOT_FOUND);
    });

    it("should return false because the card doesnt exist", () => {
        expect(cardManagerService.removeCard3D(0)).to.equal(CARD_NOT_FOUND);
    });

    it("should return undefined because there is no more card there", () => {
        expect(cardManagerService.getCards().list3D[1]).deep.equal(undefined);
    });

    it("corresponding highscore to the gameID should exist", () => {
        cardManagerService.addCard2D(c1);
        expect(highscoreService.findHighScoreByID(4)).to.be.equal(2);
    });

    it("Should return an error message", async () => {
        mock.onGet("/api/differenceChecker/validate").reply(200, {
            title: Constants.ON_ERROR_MESSAGE,
            body: Constants.VALIDATION_FAILED,
        });
        let messageTitle: string = "";
        await cardManagerService.simpleCardCreationRoutine(testImageOg, testImageOg, "title")
        .then((message: Message) => {
            messageTitle = message.title;
        });
        expect(messageTitle).to.equal("onError");
        mock.restore();
    });

    it("Should return false when the title already exists", () => {
        expect(cardManagerService.isSceneNameNew("Dylan QT")).to.equal(false);
    });
});
