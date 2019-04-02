import "reflect-metadata";

import * as chai from "chai";
import * as spies from "chai-spies";
import * as SocketIO from "socket.io";
import { mock } from "ts-mockito";
import { GameMode, ICard } from "../../../common/communication/iCard";
import { Message } from "../../../common/communication/message";
import { CCommon } from "../../../common/constantes/cCommon";
import { CServer } from "../CServer";
import { AssetManagerService } from "../services/asset-manager.service";
import { CardOperations } from "../services/card-operations.service";
import { HighscoreService } from "../services/highscore.service";

// tslint:disable no-magic-numbers no-any max-line-length
const FAKE_PATH:        string = CCommon.BASE_URL  + CCommon.BASE_SERVER_PORT + "/image";
const CARD_NOT_FOUND:   string = "Erreur de suppression, carte pas trouvée";
const ERROR_DELETION:   string = "error while deleting file";

let highscoreService:       HighscoreService;
let assetManagerService:    AssetManagerService;
let cardOperations:         CardOperations;

describe("Card-operations tests", () => {
    chai.use(spies);
    const c1: ICard = {
        gameID:             4,
        title:              "Default 2D",
        subtitle:           "default 2D",
        avatarImageUrl:     FAKE_PATH + "/elon.jpg",
        gameImageUrl:       FAKE_PATH + "/elon.jpg",
        gamemode:           GameMode.simple,
    };

    const c2: ICard = {
        gameID:             7,
        title:              "Default 3D",
        subtitle:           "default 3D",
        avatarImageUrl:     FAKE_PATH + "/moutain.jpg",
        gameImageUrl:       FAKE_PATH + "/moutain.jpg",
        gamemode:           GameMode.free,
    };

    beforeEach(() => {
        assetManagerService = new AssetManagerService();
        highscoreService    = new HighscoreService(assetManagerService);
        cardOperations      = new CardOperations(highscoreService);
    });

    it("should return true when adding a new 2D card", () => {
        chai.expect(cardOperations.addCard(c1)).to.equal(true);
        cardOperations.removeCard2D(c1.gameID);
    });

    it("should return true when adding a new 3D card", () => {
        chai.expect(cardOperations.addCard(c2)).to.equal(true);
        cardOperations.removeCard3D(c2.gameID);
    });

    it("should return false when adding an existing 3D card", () => {
        cardOperations.addCard(c2);
        chai.expect(cardOperations.addCard(c2)).to.equal(false);
        cardOperations.removeCard3D(c2.gameID);
    });

    it("should return false when trying to add an existing 2d card", () => {
        cardOperations.addCard(c1);
        chai.expect(cardOperations.addCard(c1)).to.equal(false);
        cardOperations.removeCard2D(c1.gameID);
    });

    it("should return the existing card simple mode", () => {
        cardOperations.addCard(c1);
        chai.expect(cardOperations.getCardById("4", GameMode.simple)).to.deep.equal(c1);
        cardOperations.removeCard2D(c1.gameID);
    });

    it("should return an error message because path image doesnt exist", () => {
        cardOperations.addCard(c1);
        chai.expect(cardOperations.removeCard2D(4)).to.equal(ERROR_DELETION);
        cardOperations.removeCard2D(c1.gameID);
    });

    it("should return an error while deleting the default 2D card", () => {
        chai.expect(cardOperations.removeCard2D(1)).deep.equal(CServer.DELETION_ERROR_MESSAGE);
    });

    it("should return an error while deleting the default 3D card", () => {
        chai.expect(cardOperations.removeCard3D(2)).deep.equal(CServer.DELETION_ERROR_MESSAGE);
    });

    it("should return false because the card doesnt exist", () => {
        chai.expect(cardOperations.removeCard2D(0)).to.equal(CARD_NOT_FOUND);
    });

    it("should return false because the card doesnt exist", () => {
        chai.expect(cardOperations.removeCard3D(0)).to.equal(CARD_NOT_FOUND);
    });

    it("should return an error message because path image doesnt exist", () => {
        cardOperations["socketServer"] = mock(SocketIO);
        cardOperations.addCard(c1);
        chai.expect(cardOperations.removeCard2D(4)).to.equal(ERROR_DELETION);
        cardOperations.removeCard2D(c1.gameID);
    });

    it("should delete card 2D with specific card id", () => {
        const originalImagePath:    string              = CServer.IMAGES_PATH + "/" + 4 + CCommon.ORIGINAL_FILE;
        const modifiedImagePath:    string              = CServer.IMAGES_PATH + "/" + 4 + CCommon.MODIFIED_FILE;
        const generatedImagePath:   string              = CServer.IMAGES_PATH + "/" + 4 + CServer.GENERATED_FILE;
        const assetManager:         AssetManagerService = new AssetManagerService();

        cardOperations.addCard(c1);

        assetManager.saveImage(originalImagePath,  "test");
        assetManager.saveImage(modifiedImagePath,  "test");
        assetManager.saveImage(generatedImagePath, "test");

        cardOperations["socketServer"] = mock(SocketIO);

        chai.expect(cardOperations.removeCard2D(4)).to.equal(CServer.CARD_DELETED);
        cardOperations.removeCard2D(c1.gameID);
    });

    it("should delete card 3D with specific card id", () => {
        const snapshot:             string = CServer.IMAGES_PATH + "/" + 7 + CServer.GENERATED_SNAPSHOT;
        const generatedScene:       string = CServer.SCENE_PATH  + "/" + 7 + CCommon.SCENE_FILE;
        const assetManager:         AssetManagerService = new AssetManagerService();

        cardOperations.addCard(c2);

        assetManager.saveImage(snapshot, "test");
        assetManager.saveGeneratedScene(generatedScene, "test");

        cardOperations["socketServer"] = mock(SocketIO);

        chai.expect(cardOperations.removeCard3D(7)).to.equal(CServer.CARD_DELETED);
        cardOperations.removeCard3D(c2.gameID);
    });

    it("should generate message with unknown error", () => {
        const error:    SyntaxError = new SyntaxError();
        const result:   Message     = cardOperations.generateErrorMessage(error);

        chai.expect(result).to.deep.equal({title: CCommon.ON_ERROR, body: CServer.UNKNOWN_ERROR});
    });

    it("should set socket server", () => {
        const mockSocket: any = mock(SocketIO);
        cardOperations.setServer(mockSocket);

        chai.expect(cardOperations["socketServer"]).to.equal(mockSocket);
    });

});
