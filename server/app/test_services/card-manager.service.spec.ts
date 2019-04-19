import "reflect-metadata";

import * as chai from "chai";
import * as spies from "chai-spies";
import * as fs from "fs";
import * as path from "path";
import { GameMode, ICard } from "../../../common/communication/iCard";
import { ICardsIds } from "../../../common/communication/iCardLists";
import { ISceneMessage } from "../../../common/communication/iSceneMessage";
import { ISceneObject } from "../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../common/communication/iSceneVariables";
import { Message } from "../../../common/communication/message";
import { CCommon } from "../../../common/constantes/cCommon";
import { AssetManagerService } from "../services/asset-manager.service";
import { CardManagerService } from "../services/card-manager.service";
import { CardOperations } from "../services/card-operations.service";
import { ImageRequirements } from "../services/difference-checker/utilities/imageRequirements";
import { HighscoreService } from "../services/highscore.service";

/*tslint:disable no-magic-numbers no-any max-file-line-count max-line-length arrow-return-shorthand no-floating-promises*/

const FAKE_PATH:            string  = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT  + "/image";
const mockAdapter:          any     = require("axios-mock-adapter");
const axios:                any     = require("axios");

const cardsIds2D: ICardsIds = {
    descriptions: [
        {id: 1000, title: "title1", gamemode: GameMode.simple},
        {id: 2000, title: "title2", gamemode: GameMode.simple},
    ],
    index2D: 10,
    index3D: 10,
};

const card2D: ICard = {
    gameID:             4,
    title:              "Default 3D",
    subtitle:           "default 3D",
    avatarImageUrl:     FAKE_PATH + "/moutain.jpg",
    gameImageUrl:       FAKE_PATH + "/moutain.jpg",
    gamemode:           GameMode.free,
};

const path2DValidation: string = "http://localhost:3000/api/differenceChecker";
const original: Buffer = fs.readFileSync(path.resolve(__dirname, "../asset/image/testBitmap/imagetestOg.bmp"));
const modified: Buffer = fs.readFileSync(path.resolve(__dirname, "../asset/image/testBitmap/imagetestOg.bmp"));

const imageRequirements: ImageRequirements = {
    requiredHeight:     480,
    requiredWidth:      640,
    requiredNbDiff:     7,
    originalImage:      original,
    modifiedImage:      modified,
};

const cardsIds: ICardsIds = {
    descriptions: [
        {id: 1001, title: "motherfuckingTitle2D", gamemode: GameMode.simple},
        {id: 2001, title: "motherfuckingTitle3D", gamemode: GameMode.free},
    ],
    index2D: 10,
    index3D: 10,
};

const sceneObject: ISceneObject = {
    id:         1,
    type:       1,
    position:   {x: 1, y: 2, z: 3},
    rotation:   {x: 1, y: 2, z: 3},
    color:      "#FFFFFF",
    scale:      {x: 1, y: 2, z: 3},
    hidden:     true,
};

const sceneVariables: ISceneVariables<ISceneObject> = {
    theme:                  1,
    gameName:               "fokoffMichael",
    sceneObjectsQuantity:   5,
    sceneObjects:           [sceneObject],
    sceneBackgroundColor:   "#FFFFFF",
};

const sceneMessage: ISceneMessage = {
    sceneData: {
        originalScene: sceneVariables,
        modifiedScene: sceneVariables,
        modifications: [{id: 1, type: 6}],
    },
    image: "imagefromJpeg",
};

let mockAxios:              any;
let cardManagerService:     CardManagerService;
let highscoreService:       HighscoreService;
let cardOperations:         CardOperations;
let assetManagerService:    AssetManagerService;

describe("Card-manager tests", () => {
    chai.use(spies);

    beforeEach(() => {
        assetManagerService = new AssetManagerService();
        highscoreService    = new HighscoreService(assetManagerService);
        cardOperations      = new CardOperations(highscoreService);
        cardManagerService  = new CardManagerService(cardOperations);
        mockAxios           = new mockAdapter.default(axios);
    });

    afterEach(() => {
        mockAxios.restore();
    });

    it("should return the list of all cards", () => {
        chai.spy.on(cardManagerService["imageManagerService"], "getCardsIds", () => {return cardsIds2D; });
        chai.spy.on(cardManagerService["imageManagerService"], "getCardById", () => {return card2D; });
        chai.expect(cardManagerService.getCards().list2D.length).to.equal(2);
    });

    it("should return error message with alphanumeric problem when calling simpleCardCreationRoutine()", () => {

        cardManagerService.simpleCardCreationRoutine(imageRequirements, "aCardTitle!!!").then((message: Message) => {
            chai.expect(message).to.deep.equal({title: "onError", body: "Le titre du jeu doit contenir seulement des caracteres alphanumeriques"});
        });
    });

    it("should return error message with length problem when calling simpleCardCreationRoutine()", () => {

        cardManagerService.simpleCardCreationRoutine(imageRequirements, "aCardTitleawdawawdawadawawdawdawdawdawddaad").then((message: Message) => {
            chai.expect(message).to.deep.equal({title: "onError", body: "Le titre du jeu doit contenir entre 5 et 20 caracteres"});
        });
    });

    it("should return a message and not create card when calling simpleCardCreationRoutine()", () => {
        mockAxios.onPost(path2DValidation).reply(200, {title: "patate", body: "taMereEnShort"});

        cardManagerService.simpleCardCreationRoutine(imageRequirements, "aCardTitle").then((message: Message) => {
            chai.expect(message).to.deep.equal({title: "patate", body: "taMereEnShort"});
        });
    });

    it("should return success message when calling simpleCardCreationRoutine()", () => {
        chai.spy.on(cardManagerService["cardOperations"], "addCard", () => {return true; });
        chai.spy.on(cardManagerService["imageManagerService"], "stockImage", () => {return; });
        chai.spy.on(cardManagerService["imageManagerService"], "createBMP", () => {return; });
        mockAxios.onPost(path2DValidation).reply(200, original);

        cardManagerService.simpleCardCreationRoutine(imageRequirements, "aCardTitle").then((message: Message) => {
            chai.expect(message).to.deep.equal({ title: "onSuccess", body: "Card 11 created" });
        });
    });

    it("should return success message with card 10 when calling simpleCardCreationRoutine()", () => {
        chai.spy.on(cardManagerService["imageManagerService"], "getCardsIds", () => {return cardsIds; });
        chai.spy.on(cardManagerService["cardOperations"], "addCard", () => {return true; });
        chai.spy.on(cardManagerService["imageManagerService"], "stockImage", () => {return; });
        chai.spy.on(cardManagerService["imageManagerService"], "createBMP", () => {return; });
        mockAxios.onPost(path2DValidation).reply(200, original);

        cardManagerService.simpleCardCreationRoutine(imageRequirements, "aCardTitle").then((message: Message) => {
            chai.expect(message).to.deep.equal({ title: "onSuccess", body: "Card 10 created" });
        });
    });

    it("should return card existing message when calling simpleCardCreationRoutine()", () => {
        chai.spy.on(cardManagerService["cardOperations"], "addCard", () => {return false; });
        chai.spy.on(cardManagerService["imageManagerService"], "stockImage", () => {return; });
        chai.spy.on(cardManagerService["imageManagerService"], "createBMP", () => {return; });
        mockAxios.onPost(path2DValidation).reply(200, original);

        cardManagerService.simpleCardCreationRoutine(imageRequirements, "aCardTitle").then((message: Message) => {
            chai.expect(message).to.deep.equal({title: "onError", body: "Le titre de la carte existe déjà"});
        });
    });

    it("should generateError if post fails when calling simpleCardCreationRoutine()", () => {
        mockAxios.onPost(path2DValidation).reply(400);

        cardManagerService.simpleCardCreationRoutine(imageRequirements, "aCardTitle").then((message: Message) => {
            chai.expect(message).to.deep.equal({title: "onError", body: "Erreur inconnue"});
        });
    });

    it("should return successMessage when calling freeCardCreationRoutine()", () => {
        chai.spy.on(cardManagerService["imageManagerService"], "saveImage", () => {return; });
        chai.spy.on(cardManagerService["imageManagerService"], "saveGeneratedScene", () => {return; });
        chai.spy.on(cardManagerService["cardOperations"], "addCard", () => {return true; });

        const result: Message = cardManagerService.freeCardCreationRoutine(sceneMessage);

        chai.expect(result).to.deep.equal({title: "onSuccess", body: "Carte ajoutée"});
    });

    it("should return successMessage with a new Id when calling freeCardCreationRoutine()", () => {
        chai.spy.on(cardManagerService["imageManagerService"], "saveImage", () => {return; });
        chai.spy.on(cardManagerService["imageManagerService"], "saveGeneratedScene", () => {return; });
        chai.spy.on(cardManagerService["cardOperations"], "addCard", () => {return true; });

        const result: Message = cardManagerService.freeCardCreationRoutine(sceneMessage);

        chai.expect(result).to.deep.equal({title: "onSuccess", body: "Carte ajoutée"});
    });

    it("should return error message if card exist already when calling freeCardCreationRoutine()", () => {
        chai.spy.on(cardManagerService["imageManagerService"], "getCardsIds", () => {return cardsIds; });
        chai.spy.on(cardManagerService["imageManagerService"], "saveImage", () => {return; });
        chai.spy.on(cardManagerService["imageManagerService"], "saveGeneratedScene", () => {return; });
        chai.spy.on(cardManagerService["cardOperations"], "addCard", () => {return false; });

        const result: Message = cardManagerService.freeCardCreationRoutine(sceneMessage);

        chai.expect(result).to.deep.equal({title: "onError", body: "Le titre de la carte existe déjà"});
    });

    it("should generateErrorMessage with a specific message", () => {
        const error: TypeError = new TypeError("C'est Wrrronnnngg");
        const result: Message = cardManagerService["generateErrorMessage"](error);
        chai.expect(result).to.deep.equal({title: "onError", body: error.message});
    });
});
