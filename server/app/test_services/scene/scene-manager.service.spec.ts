import { expect } from "chai";
import "reflect-metadata";
import { SceneObjectType } from "../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { FormMessage } from "../../../../common/communication/message";
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
            quantityChange: 1,
        };

        const result: ISceneVariables | string = sceneManager.createScene(formMessage);
        if (typeof result !== "string") {
            expect(result.sceneObjects[0].type).to.be.equal(SceneObjectType.Cube);
        }
    });

    it("should generate new interface for sphere of ISceneVariables", () => {

        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            selectedOption: "sphere",
            quantityChange: 1,
        };

        const result: ISceneVariables | string = sceneManager.createScene(formMessage);
        if (typeof result !== "string") {
            expect(result.sceneObjects[0].type).to.be.equal(SceneObjectType.Sphere);
        }
    });

    it("should generate new interface for cylinder of ISceneVariables", () => {

        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            selectedOption: "cylinder",
            quantityChange: 3,
        };

        const result: ISceneVariables | string = sceneManager.createScene(formMessage);
        if (typeof result !== "string") {
            expect(result.sceneObjects[0].type).to.be.equal(SceneObjectType.Cylinder);
        }
    });

    it("should generate new interface for cone of ISceneVariables", () => {

        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            selectedOption: "cone",
            quantityChange: 4,
        };

        const result: ISceneVariables | string = sceneManager.createScene(formMessage);
        if (typeof result !== "string") {
            expect(result.sceneObjects[0].type).to.be.equal(SceneObjectType.Cone);
        }
    });

    it("should generate new interface for pyramid of ISceneVariables", () => {

        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            selectedOption: "pyramid",
            quantityChange: 5,
        };

        const result: ISceneVariables | string = sceneManager.createScene(formMessage);
        if (typeof result !== "string") {
            expect(result.sceneObjects[0].type).to.be.equal(SceneObjectType.TriangularPyramid);
        }
    });

});
