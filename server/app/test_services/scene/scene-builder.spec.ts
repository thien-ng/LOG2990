import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { SceneObjectType } from "../../../../common/communication/iSceneObject";
import { ISceneOptions } from "../../../../common/communication/iSceneOptions";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { SceneBuilder } from "../../services/scene/scene-builder";

/* tslint:disable:no-any no-magic-numbers */
let sceneBuilder: SceneBuilder;

describe("Scene builder tests", () => {

    const sceneOptions10: ISceneOptions = {
        sceneName: "1 objet",
        sceneObjectsType: SceneObjectType.Cube,
        sceneObjectsQuantity: 10,
    };

    const sceneOptions200: ISceneOptions = {
        sceneName: "200 objet",
        sceneObjectsType: SceneObjectType.Cube,
        sceneObjectsQuantity: 200,
    };

    const sceneOptions2000: ISceneOptions = {
        sceneName: "2000 objet",
        sceneObjectsType: SceneObjectType.Cube,
        sceneObjectsQuantity: 2000,
    };

    beforeEach(() => {

        chai.use(spies);

        sceneBuilder = new SceneBuilder();
    });

    it("should generate a SceneObject[] of length 10", () => {
        const scene: ISceneVariables = sceneBuilder.generateScene(sceneOptions10);
        chai.expect(scene.sceneObjects.length).equal(10);
    });

    it("should generate a SceneObject[] of length 200", () => {
        const scene: ISceneVariables = sceneBuilder.generateScene(sceneOptions200);
        chai.expect(scene.sceneObjects.length).equal(200);
    });

    it("should generate a SceneObject[] of length 2000", () => {
        const scene: ISceneVariables = sceneBuilder.generateScene(sceneOptions2000);
        chai.expect(scene.sceneObjects.length).equal(2000);
    });

});
