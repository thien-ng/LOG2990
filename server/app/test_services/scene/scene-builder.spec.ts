import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { ISceneObject, SceneObjectType } from "../../../../common/communication/iSceneObject";
import { ISceneOptions } from "../../../../common/communication/iSceneOptions";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { SceneBuilder } from "../../services/scene/scene-builder";

/* tslint:disable:no-any no-magic-numbers */
let sceneBuilder: SceneBuilder;

describe("Scene builder tests", () => {

    const sceneOptions10Cubes: ISceneOptions = {
        sceneName: "10 cubes",
        sceneObjectsType: SceneObjectType.Cube,
        sceneObjectsQuantity: 10,
    };

    const sceneOptions10Spheres: ISceneOptions = {
        sceneName: "10 cubes",
        sceneObjectsType: SceneObjectType.Sphere,
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
        const scene: ISceneVariables = sceneBuilder.generateScene(sceneOptions10Cubes);
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

    it("should generate scene objects of type Cube", () => {
        const scene: ISceneVariables = sceneBuilder.generateScene(sceneOptions10Cubes);
        let isAllCubes: boolean = true;

        scene.sceneObjects.forEach((element: ISceneObject) => {
            if (element.type !== SceneObjectType.Cube) {
                isAllCubes = false;
            }
        });

        chai.expect(isAllCubes).equal(true);
    });

    it("should generate scene objects of type Sphere", () => {
        const scene: ISceneVariables = sceneBuilder.generateScene(sceneOptions10Spheres);
        let isAllCubes: boolean = true;

        scene.sceneObjects.forEach((element: ISceneObject) => {
            if (element.type !== SceneObjectType.Sphere) {
                isAllCubes = false;
            }
        });

        chai.expect(isAllCubes).equal(true);
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
