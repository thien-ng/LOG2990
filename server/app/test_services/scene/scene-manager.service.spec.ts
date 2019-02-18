import { expect } from "chai";
import "reflect-metadata";
import { SceneObjectType } from "../../../../common/communication/iSceneObject";
import { ISceneVariablesMessage } from "../../../../common/communication/iSceneVariables";
import { FormMessage } from "../../../../common/communication/message";
import { Constants } from "../../constants";
import { CardManagerService } from "../../services/card-manager.service";
import { HighscoreService } from "../../services/highscore.service";
import { SceneManager } from "../../services/scene/scene-manager.service";

let sceneManager: SceneManager;
let formMessage: FormMessage;
let cardManagerService: CardManagerService;
let highscoreService: HighscoreService;

beforeEach(() => {
    highscoreService = new HighscoreService();
    cardManagerService = new CardManagerService(highscoreService);
    sceneManager = new SceneManager(cardManagerService);
});

describe("SceneManager Tests", () => {

    it("should generate new interface for cube of ISceneVariables", () => {

        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            selectedOption: "cube",
            quantityChange: 10,
        };

        const result: ISceneVariablesMessage | string = sceneManager.createScene(formMessage);
        if (typeof result !== "string") {
            expect(result.originalScene.sceneObjects[0].type).to.be.equal(SceneObjectType.Cube);
        }
    });

    it("should generate new interface for sphere of ISceneVariables", () => {

        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            selectedOption: "sphere",
            quantityChange: 10,
        };

        const result: ISceneVariablesMessage | string = sceneManager.createScene(formMessage);
        if (typeof result !== "string") {
            expect(result.originalScene.sceneObjects[0].type).to.be.equal(SceneObjectType.Sphere);
        }
    });

    it("should generate new interface for cylinder of ISceneVariables", () => {

        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            selectedOption: "cylinder",
            quantityChange: 10,
        };

        const result: ISceneVariablesMessage | string = sceneManager.createScene(formMessage);
        if (typeof result !== "string") {
            expect(result.originalScene.sceneObjects[0].type).to.be.equal(SceneObjectType.Cylinder);
        }
    });

    it("should generate new interface for cone of ISceneVariables", () => {

        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            selectedOption: "cone",
            quantityChange: 10,
        };

        const result: ISceneVariablesMessage | string = sceneManager.createScene(formMessage);
        if (typeof result !== "string") {
            expect(result.originalScene.sceneObjects[0].type).to.be.equal(SceneObjectType.Cone);
        }
    });

    it("should generate new interface for pyramid of ISceneVariables", () => {

        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            selectedOption: "pyramid",
            quantityChange: 10,
        };

        const result: ISceneVariablesMessage | string = sceneManager.createScene(formMessage);
        if (typeof result !== "string") {
            expect(result.originalScene.sceneObjects[0].type).to.be.equal(SceneObjectType.TriangularPyramid);
        }
    });

    it("should return an error message when a game with the same name exists", () => {

        formMessage = {
            gameName: "Dylan QT",
            checkedTypes: [true, true, true],
            selectedOption: "pyramid",
            quantityChange: 5,
        };

        const result: ISceneVariablesMessage | string = sceneManager.createScene(formMessage);
        if (typeof result === "string") {
            expect(result).to.equal(Constants.CARD_EXISTING);
        }
    });

});
