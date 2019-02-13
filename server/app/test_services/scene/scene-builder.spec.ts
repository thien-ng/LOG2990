import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { SceneObjectType } from "../../../../common/communication/iSceneObject";
import { ISceneOptions } from "../../../../common/communication/iSceneOptions";
import { SceneBuilder } from "../../services/scene/scene-builder";

/* tslint:disable:no-any */
let sceneBuilder: SceneBuilder;

describe("Scene builder tests", () => {

    const sceneOptions: ISceneOptions = {
        sceneName: "nouvelleScene",
        sceneObjectsType: SceneObjectType.Cube,
        sceneObjectsQuantity: 20,
    };

    beforeEach(() => {

        chai.use(spies);

        sceneBuilder = new SceneBuilder(sceneOptions);
    });

    // tests
    it("should call the generateRandomAxisValues function when generating scene objects", () => {
        const spy: any = chai.spy.on(sceneBuilder, "generateRandomAxisValues");
        sceneBuilder.generateSceneObjects();
        chai.expect(spy).to.have.been.called();
    });
});
