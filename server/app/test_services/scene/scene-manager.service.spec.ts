import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { FormMessage } from "../../../../common/communication/message";
import { SceneManager } from "../../services/scene/scene-manager.service";

/* tslint:disable:no-any no-magic-numbers */

let sceneManager: SceneManager;
let formMessage: FormMessage;

beforeEach(() => {
    chai.use(spies);
    sceneManager = new SceneManager();
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

    it("should return scene variables with Geometric theme", async () => {
        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            theme: "Geometric",
            quantityChange: 10,
        };

        const sceneVariables: ISceneVariables = await sceneManager.createScene(formMessage);

        chai.expect(sceneVariables.theme).equal(0);
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

    it("should return scene variables with Thematic theme", async () => {
        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            theme: "Thematic",
            quantityChange: 10,
        };

        const sceneVariables: ISceneVariables = await sceneManager.createScene(formMessage);

        chai.expect(sceneVariables.theme).equal(1);
    });

    it("should return scene variables with Geometric theme by default", async () => {
        formMessage = {
            gameName: "gameName",
            checkedTypes: [true, true, true],
            theme: "default",
            quantityChange: 10,
        };

        const sceneVariables: ISceneVariables = await sceneManager.createScene(formMessage);

        chai.expect(sceneVariables.theme).equal(0);
    });
});
