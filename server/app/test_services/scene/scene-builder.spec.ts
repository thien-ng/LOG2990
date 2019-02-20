import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { ISceneObject } from "../../../../common/communication/iSceneObject";
import { ISceneOptions, SceneType } from "../../../../common/communication/iSceneOptions";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { SceneBuilder } from "../../services/scene/scene-builder";

/* tslint:disable:no-any no-magic-numbers */
let sceneBuilder: SceneBuilder;

describe("Scene builder tests", () => {

    const sceneOptions10: ISceneOptions = {
        sceneName: "10 objects",
        sceneType: SceneType.Geometric,
        sceneObjectsQuantity: 10,
        selectedOptions: [true, true, true],
    };

    const sceneOptions200: ISceneOptions = {
        sceneName: "200 objects",
        sceneType: SceneType.Geometric,
        sceneObjectsQuantity: 200,
        selectedOptions: [true, true, true],
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

    it("should generate scene objects of valid type", () => {
        const scene: ISceneVariables = sceneBuilder.generateScene(sceneOptions10);
        let areAllTypesValid: boolean = false;

        scene.sceneObjects.forEach((element: ISceneObject) => {
            if (element.type >= 0 && element.type <= 4) {
                areAllTypesValid = true;
            }
        });

        chai.expect(areAllTypesValid).equal(true);
    });

    it("should generate colors in hex format", () => {

        const color: string = sceneBuilder.generateRandomColor();
        chai.expect(color.slice(0, 1)).equal("#");
    });

    it("should generate colors as string of length 8", () => {

        const color: string = sceneBuilder.generateRandomColor();
        chai.expect(color.length).equal(7);
    });

});
