import "reflect-metadata";

import * as chai from "chai";
import * as spies from "chai-spies";
import * as fs from "fs";
import * as path from "path";
import { DefaultCard2D, DefaultCard3D, GameMode, ICard } from "../../../common/communication/iCard";
import { ICardLists } from "../../../common/communication/iCardLists";
import { ISceneMessage } from "../../../common/communication/iSceneMessage";
import { ISceneOptions, SceneType } from "../../../common/communication/iSceneOptions";
import { ISceneVariables } from "../../../common/communication/iSceneVariables";
import { Message } from "../../../common/communication/message";
import { Constants } from "../constants";
import { AssetManagerService } from "../services/asset-manager.service";
import { CardManagerService } from "../services/card-manager.service";
import { HighscoreService } from "../services/highscore.service";
import { SceneBuilder } from "../services/scene/scene-builder";

/*tslint:disable no-magic-numbers no-any */

const mockAdapter: any = require("axios-mock-adapter");
const axios: any = require("axios");
const mock: any = new mockAdapter(axios);
const CARD_NOT_FOUND: string = "Erreur de suppression, carte pas trouvée";
const FAKE_PATH: string = Constants.BASE_URL + "/image";
let cardManagerService: CardManagerService;
let highscoreService: HighscoreService;

describe("Card-manager tests", () => {
    chai.use(spies);
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
        chai.expect(cardManagerService.getCards()).deep.equal(cards);
    });

    it("should return the defaut 2d card", () => {
       chai.expect(cardManagerService.getCardById("1", GameMode.simple)).to.deep.equal(DefaultCard2D);
    });

    it("should return true when adding a new 2D card", () => {
        chai.expect(cardManagerService.addCard2D(c1)).to.equal(true);
    });

    it("should return true when adding a new 3D card", () => {
        chai.expect(cardManagerService.addCard3D(c2)).to.equal(true);
    });

    it("should return false when adding an existing 3D card", () => {
        cardManagerService.addCard3D(c2);
        chai.expect(cardManagerService.addCard3D(c2)).to.equal(false);
    });

    it("should return false when trying to add an existing 2d card", () => {
        cardManagerService.addCard2D(c1);
        chai.expect(cardManagerService.addCard2D(c1)).to.equal(false);
    });

    it("should return new length of 3D list after adding a card", () => {
        cardManagerService.addCard3D(c2);
        cardManagerService.addCard3D(c3);
        chai.expect(cardManagerService.getCards().list3D.length).to.equal(3);
    });

    it("should return the newly added card", () => {
        cardManagerService.addCard3D(c3);
        chai.expect(cardManagerService.getCards().list3D[0]).deep.equal(c3);
    });

    it("should return the existing card", () => {
        cardManagerService.addCard3D(c3);
        chai.expect(cardManagerService.getCardById("3", GameMode.free)).to.deep.equal(c3);
    });

    it("should return an error message because path image doesnt exist", () => {
        cardManagerService.addCard2D(c1);
        chai.expect(cardManagerService.removeCard2D(4)).to.equal("error while deleting file");
    });

    it("should return an error message because path image doesnt exist", () => {
        cardManagerService.addCard3D(c3);
        chai.expect(cardManagerService.removeCard3D(3)).to.equal("error while deleting file");
    });

    it("should return an error while deleting the default 2D card", () => {
        chai.expect(cardManagerService.removeCard2D(1)).deep.equal(Constants.DELETION_ERROR_MESSAGE);
    });

    it("should return an error while deleting the default 3D card", () => {
        chai.expect(cardManagerService.removeCard3D(1)).deep.equal(Constants.DELETION_ERROR_MESSAGE);
    });

    it("should return false because the card doesnt exist", () => {
        chai.expect(cardManagerService.removeCard2D(0)).to.equal(CARD_NOT_FOUND);
    });

    it("should return false because the card doesnt exist", () => {
        chai.expect(cardManagerService.removeCard3D(0)).to.equal(CARD_NOT_FOUND);
    });

    it("should return undefined because there is no more card there", () => {
        chai.expect(cardManagerService.getCards().list3D[1]).deep.equal(undefined);
    });

    it("corresponding highscore to the gameID should exist", () => {
        cardManagerService.addCard2D(c1);
        chai.expect(highscoreService.findHighScoreByID(4)).to.be.equal(2);
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
        chai.expect(messageTitle).to.equal("onError");
        mock.restore();
    });
    it("Should return an success message when creating a freeCard successfully", () => {
        const sceneOptions10: ISceneOptions = {
            sceneName: "10 objects",
            sceneType: SceneType.Geometric,
            sceneObjectsQuantity: 10,
        };
        const sceneBuilder: SceneBuilder = new SceneBuilder();
        const sceneVariable: ISceneVariables = sceneBuilder.generateScene(sceneOptions10);
        const sceneMessage: ISceneMessage = {
            sceneVariable: sceneVariable,
            image: "",
        };
        const message: Message = {
            title: Constants.ON_SUCCESS_MESSAGE,
            body: Constants.CARD_ADDED,
        };
        chai.expect(cardManagerService.freeCardCreationRoutine(sceneMessage)).to.deep.equal(message);
        cardManagerService.removeCard3D(2000);
    });

    it("Should return false when the title already exists", () => {
        chai.expect(cardManagerService.isSceneNameNew("Dylan QT")).to.equal(false);
    });

    it("trying the splice", () => {
        const assetManager: AssetManagerService = new AssetManagerService();
        cardManagerService.addCard2D(c1);
        const originalImagePath: string = Constants.IMAGES_PATH + "/" + 4 + Constants.ORIGINAL_FILE;
        const modifiedImagePath: string = Constants.IMAGES_PATH + "/" + 4 + Constants.MODIFIED_FILE;
        const generatedImagePath: string =  Constants.IMAGES_PATH + "/" + 4 + Constants.GENERATED_FILE;
        assetManager.saveImage(originalImagePath, "test");
        assetManager.saveImage(modifiedImagePath, "test");
        assetManager.saveImage(generatedImagePath, "test");
        chai.expect(cardManagerService.removeCard2D(4)).to.equal(Constants.CARD_DELETED);
    });
});
