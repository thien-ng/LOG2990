import "reflect-metadata";

import * as chai from "chai";
import * as spies from "chai-spies";
import * as fs from "fs";
import * as path from "path";
import { DefaultCard2D, DefaultCard3D, GameMode, ICard } from "../../../common/communication/iCard";
import { ICardLists } from "../../../common/communication/iCardLists";
import { ISceneMessage } from "../../../common/communication/iSceneMessage";
import { ISceneOptions, SceneType } from "../../../common/communication/iSceneOptions";
import { ISceneVariables, ISceneVariablesMessage } from "../../../common/communication/iSceneVariables";
import { Message } from "../../../common/communication/message";
import { Constants } from "../constants";
import { CardManagerService } from "../services/card-manager.service";
import { CardOperations } from "../services/card-operations.service";
import { HighscoreService } from "../services/highscore.service";
import { SceneBuilder } from "../services/scene/scene-builder";
import { SceneModifier } from "../services/scene/scene-modifier";

/*tslint:disable no-magic-numbers no-any */

const mockAdapter: any = require("axios-mock-adapter");
const axios: any = require("axios");
const mock: any = new mockAdapter(axios);
const FAKE_PATH: string = Constants.BASE_URL + "/image";
let cardManagerService: CardManagerService;
let highscoreService: HighscoreService;
let cardOperations: CardOperations;

describe("Card-manager tests", () => {
    chai.use(spies);
    const testImageOg: Buffer = fs.readFileSync(path.resolve(__dirname, "../asset/image/testBitmap/imagetestOg.bmp"));

    const cards: ICardLists = {
        list2D: [DefaultCard2D],
        list3D: [DefaultCard3D],
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

    beforeEach(() => {
        highscoreService = new HighscoreService();
        cardOperations = new CardOperations(highscoreService);
        cardManagerService = new CardManagerService(cardOperations);
    });

    it("should return the list of all cards", () => {
        chai.expect(cardManagerService.getCards()).deep.equal(cards);
    });

    it("should return new length of 3D list after adding a card", () => {
        cardOperations.addCard3D(c2);
        cardOperations.addCard3D(c3);
        chai.expect(cardManagerService.getCards().list3D.length).to.equal(3);
    });

    it("should return the newly added card", () => {
        cardOperations.addCard3D(c3);
        chai.expect(cardManagerService.getCards().list3D[0]).deep.equal(c3);
    });

    it("should return undefined because there is no more card there", () => {
        chai.expect(cardManagerService.getCards().list3D[1]).deep.equal(undefined);
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
            selectedOptions: [false, false, false],
        } as ISceneOptions;
        const sceneBuilder: SceneBuilder = new SceneBuilder();
        const sceneModifier: SceneModifier = new SceneModifier(sceneBuilder);
        const isceneVariable: ISceneVariables = sceneBuilder.generateScene(sceneOptions10);
        const iSceneVariablesMessage: ISceneVariablesMessage = {
            originalScene: isceneVariable,
            modifiedScene: sceneModifier.modifyScene(sceneOptions10, isceneVariable),
        };
        const sceneMessage: ISceneMessage = {
            iSceneVariablesMessage: iSceneVariablesMessage,
            image: "",
        };
        const message: Message = {
            title: Constants.ON_SUCCESS_MESSAGE,
            body: Constants.CARD_ADDED,
        };
        chai.expect(cardManagerService.freeCardCreationRoutine(sceneMessage)).to.deep.equal(message);
    });

    it("Should return false when the title already exists", () => {
        chai.expect(cardManagerService.isSceneNameNew("Scène par défaut")).to.equal(false);
    });

});
