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
        sceneObjectsQuantity: 1,
    };

    const sceneOptions200: ISceneOptions = {
        sceneName: "200 objet",
        sceneObjectsType: SceneObjectType.Cube,
        sceneObjectsQuantity: 200,
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

    // it("should call the generateRandomRotationValues function when generating scene objects", () => {
    //     const spy: any = chai.spy.on(sceneBuilder, "generateRandomRotationValues");
    //     sceneBuilder.generateScene(sceneOptions1);
    //     chai.expect(spy).to.have.been.called();
    // });


});
