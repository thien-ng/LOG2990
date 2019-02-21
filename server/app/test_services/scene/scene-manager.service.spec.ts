import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { ISceneVariablesMessage } from "../../../../common/communication/iSceneVariables";
import { FormMessage } from "../../../../common/communication/message";
import { Constants } from "../../constants";
import { CardManagerService } from "../../services/card-manager.service";
import { HighscoreService } from "../../services/highscore.service";
import { SceneManager } from "../../services/scene/scene-manager.service";

/* tslint:disable:no-any no-magic-numbers */

let sceneManager: SceneManager;
let formMessage: FormMessage;
let cardManagerService: CardManagerService;
let highscoreService: HighscoreService;

beforeEach(() => {
    chai.use(spies);
    highscoreService = new HighscoreService();
    cardManagerService = new CardManagerService(highscoreService);
    sceneManager = new SceneManager(cardManagerService);
});

describe("SceneManager Tests", () => {

    it("should receive Geometric theme string", () => {
        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            theme: "Geometric",
            quantityChange: 10,
        };

        const spy: any = chai.spy.on(sceneManager, "objectTypeIdentifier");

        sceneManager.createScene(formMessage);

        chai.expect(spy).to.have.been.called.with("Geometric");
    });

    it("should return scene variables with Geometric theme", () => {
        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            theme: "Geometric",
            quantityChange: 10,
        };

        const sceneVariables: ISceneVariablesMessage | string = sceneManager.createScene(formMessage);

        if (typeof sceneVariables !== "string") {
            chai.expect(sceneVariables.originalScene.theme).to.be.equal(0);
        }
    });

    it("should should receive Thematic theme string", () => {
        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            theme: "Thematic",
            quantityChange: 10,
        };

        const spy: any = chai.spy.on(sceneManager, "objectTypeIdentifier");

        sceneManager.createScene(formMessage);

        chai.expect(spy).to.have.been.called.with("Thematic");
    });

    it("should return scene variables with Thematic theme", () => {
        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            theme: "Thematic",
            quantityChange: 10,
        };

        const sceneVariables: ISceneVariablesMessage | string = sceneManager.createScene(formMessage);

        if (typeof sceneVariables !== "string") {
            chai.expect(sceneVariables.originalScene.theme).to.be.equal(1);
        }
    });

    it("should return scene variables with Geometric theme by default", () => {
        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            theme: "default",
            quantityChange: 10,
        };

        const sceneVariables: ISceneVariablesMessage | string = sceneManager.createScene(formMessage);

        if (typeof sceneVariables !== "string") {
            chai.expect(sceneVariables.originalScene.theme).to.be.equal(0);
        }
    });

    it("should return an error message when a game with the same name exists", () => {

        formMessage = {
            gameName: "Scène par défaut",
            checkedTypes: [true, true, true],
            theme: "Geometric",
            quantityChange: 5,
        };

        const sceneVariables: ISceneVariablesMessage | string = sceneManager.createScene(formMessage);
        if (typeof sceneVariables === "string") {
            chai.expect(sceneVariables).to.equal(Constants.CARD_EXISTING);
        }
    });
});
