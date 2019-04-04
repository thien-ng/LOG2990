import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { IMesh, ISceneObject } from "../../../../common/communication/iSceneObject";
import { SceneType } from "../../../../common/communication/iSceneOptions";
import { ISceneData } from "../../../../common/communication/iSceneVariables";
import { FormMessage } from "../../../../common/communication/message";
import { CServer } from "../../CServer";
import { AssetManagerService } from "../../services/asset-manager.service";
import { CardManagerService } from "../../services/card-manager.service";
import { CardOperations } from "../../services/card-operations.service";
import { HighscoreService } from "../../services/highscore.service";
import { SceneManager } from "../../services/scene/scene-manager.service";

/* tslint:disable:no-any no-magic-numbers */

let sceneManager:       SceneManager;
let formMessage:        FormMessage;
let cardManagerService: CardManagerService;
let highscoreService:   HighscoreService;
let cardOperations:     CardOperations;
let assetManager:       AssetManagerService;

beforeEach(() => {
    chai.use(spies);
    assetManager        = new AssetManagerService();
    highscoreService    = new HighscoreService(assetManager);
    cardOperations      = new CardOperations(highscoreService);
    cardManagerService  = new CardManagerService(cardOperations);
    sceneManager        = new SceneManager(cardManagerService, assetManager);
});

describe("SceneManager Tests", () => {

    it("should receive Geometric theme string", () => {
        formMessage = {
            gameName:           "gameName",
            checkedTypes:       [true, true, true],
            theme:              "geometric",
            quantityChange:     10,
        };

        const spy: any = chai.spy.on(sceneManager, "objectTypeIdentifier");
        sceneManager.createScene(formMessage);

        chai.expect(spy).to.have.been.called.with("geometric");
    });

    it("should return scene variables with Geometric theme", () => {
        formMessage = {
            gameName:           "gameName",
            checkedTypes:       [true, true, true],
            theme:              "geometric",
            quantityChange:     10,
        };

        const sceneVariables: ISceneData<ISceneObject | IMesh> | string = sceneManager.createScene(formMessage);

        if (typeof sceneVariables !== "string") {
            chai.expect(sceneVariables.originalScene.theme).to.be.equal(0);
        }
    });

    it("should receive Thematic theme string", () => {
        formMessage = {
            gameName:           "gameName",
            checkedTypes:       [true, true, true],
            theme:              "thematic",
            quantityChange:     10,
        };

        const spy: any = chai.spy.on(sceneManager, "objectTypeIdentifier");
        sceneManager.createScene(formMessage);

        chai.expect(spy).to.have.been.called.with("thematic");
    });

    it("should return scene variables with Thematic theme", () => {
        formMessage = {
            gameName:           "gameName",
            checkedTypes:       [true, true, true],
            theme:              "thematic",
            quantityChange:     10,
        };

        const sceneVariables: ISceneData<ISceneObject | IMesh> | string = sceneManager.createScene(formMessage);

        if (typeof sceneVariables !== "string") {
            chai.expect(sceneVariables.originalScene.theme).to.be.equal(1);
        }
    });

    it("should return scene variables with Geometric theme by default", () => {
        formMessage = {
            gameName:           "gameName",
            checkedTypes:       [true, true, true],
            theme:              "default",
            quantityChange:     10,
        };

        const sceneVariables: ISceneData<ISceneObject | IMesh> | string = sceneManager.createScene(formMessage);

        if (typeof sceneVariables !== "string") {
            chai.expect(sceneVariables.originalScene.theme).to.be.equal(0);
        }
    });

    it("should return error of wrong game type message", () => {
        formMessage = {
            gameName:           "gameName",
            checkedTypes:       [true, true, true],
            theme:              "pasUnVraiJeuBro",
            quantityChange:     10,
        };

        const sceneVariables: ISceneData<ISceneObject | IMesh> | string = sceneManager.createScene(formMessage);

        if (typeof sceneVariables !== "string") {
            chai.expect(sceneVariables).to.be.equal("Les données entrées sont invalides");
        }
    });

    it("should return a scene type geometric when the default case is called", () => {

        const sceneType: SceneType | string = sceneManager["objectTypeIdentifier"]("default");
        chai.expect(sceneType).to.be.equal(SceneType.Geometric);
    });

    it("should return false if the quantity is over 200", () => {
        const isValidQuantity: boolean = sceneManager["validateQuantity"](201);
        chai.expect(isValidQuantity).to.be.equal(false);
    });

    it("should return false if the theme is invalid", () => {
        const isThemeValid: boolean = sceneManager["validateTheme"]("invalid");
        chai.expect(isThemeValid).to.be.equal(false);
    });

    it("should return false if no types are checked", () => {
        const isCheckedTypesValid: boolean = sceneManager["validateCheckedTypes"]([false, false, false]);
        chai.expect(isCheckedTypesValid).to.be.equal(false);
    });

    it("should return false if the name is invalid", () => {
        const isNameValid: boolean = sceneManager["validateName"]
        ("thisnameis wayyy too long for it to be valid, you should not be able to name a game with a name this long");
        chai.expect(isNameValid).to.be.equal(false);
    });

    it("should return an error message when a game with the same name exists", () => {

        formMessage = {
            gameName:           "Scène par défaut",
            checkedTypes:       [true, true, true],
            theme:              "geometric",
            quantityChange:     5,
        };

        const sceneVariables: ISceneData<ISceneObject | IMesh> | string = sceneManager.createScene(formMessage);
        if (typeof sceneVariables === "string") {
            chai.expect(sceneVariables).to.equal(CServer.CARD_EXISTING);
        }
    });
});
