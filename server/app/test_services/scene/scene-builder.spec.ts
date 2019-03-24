import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { ISceneObject } from "../../../../common/communication/iSceneObject";
import { ISceneOptions, SceneType } from "../../../../common/communication/iSceneOptions";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { SceneBuilder } from "../../services/scene/scene-builder";

// tslint:disable:no-any no-magic-numbers no-any only-arrow-functions
let sceneBuilder: SceneBuilder;

describe("Scene builder tests", () => {

    const sceneOptions10: ISceneOptions = {
        sceneName:              "10 objects",
        sceneType:              SceneType.Geometric,
        sceneObjectsQuantity:   10,
        selectedOptions:        [true, true, true],
    };

    const sceneOptions200: ISceneOptions = {
        sceneName:              "200 objects",
        sceneType:              SceneType.Geometric,
        sceneObjectsQuantity:   200,
        selectedOptions:        [true, true, true],
    };

    beforeEach(() => {
        chai.use(spies);
        sceneBuilder = new SceneBuilder();
    });

    it("should generate a SceneObject[] of length 10", () => {
        const scene: ISceneVariables<ISceneObject> = sceneBuilder.generateScene(sceneOptions10);
        chai.expect(scene.sceneObjects.length).equal(10);
    });

    it("should generate a SceneObject[] of length 200", () => {
        const scene: ISceneVariables<ISceneObject> = sceneBuilder.generateScene(sceneOptions200);
        chai.expect(scene.sceneObjects.length).equal(200);
    });

    it("should generate scene objects of valid type", () => {
        const scene:            ISceneVariables<ISceneObject> = sceneBuilder.generateScene(sceneOptions10);
        let areAllTypesValid:   boolean         = false;

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

    it("should generate a SceneObject[] containing the x,y,z in acceptable range with 10 objects", () => {
        const scene: ISceneVariables<ISceneObject> = sceneBuilder.generateScene(sceneOptions10);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: ISceneObject) => {

            if (!hasAcceptableRangePosition(element.position.x) ||
                !hasAcceptableRangePosition(element.position.y) ||
                !hasAcceptableRangePosition(element.position.z)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the x,y,z in acceptable range with 200 objects", () => {
        const scene: ISceneVariables<ISceneObject> = sceneBuilder.generateScene(sceneOptions200);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: ISceneObject) => {

            if (!hasAcceptableRangePosition(element.position.x) ||
                !hasAcceptableRangePosition(element.position.y) ||
                !hasAcceptableRangePosition(element.position.z)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the angle of x,y,z in acceptable range with 10 objects", () => {
        const scene: ISceneVariables<ISceneObject> = sceneBuilder.generateScene(sceneOptions10);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: ISceneObject) => {

            if (!hasAcceptableRangeAngle(element.rotation.x) ||
                !hasAcceptableRangeAngle(element.rotation.y) ||
                !hasAcceptableRangeAngle(element.rotation.z)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the angle of x,y,z in acceptable range with 200 objects", () => {
        const scene: ISceneVariables<ISceneObject> = sceneBuilder.generateScene(sceneOptions200);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: ISceneObject) => {

            if (!hasAcceptableRangeAngle(element.rotation.x) ||
                !hasAcceptableRangeAngle(element.rotation.y) ||
                !hasAcceptableRangeAngle(element.rotation.z)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the scale of x,y,z in acceptable range with 10 objects", () => {
        const scene: ISceneVariables<ISceneObject> = sceneBuilder.generateScene(sceneOptions10);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: ISceneObject) => {

            if (!hasAcceptableRangeScale(element.scale.x) ||
                !hasAcceptableRangeScale(element.scale.y) ||
                !hasAcceptableRangeScale(element.scale.z)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the scale of x,y,z in acceptable range with 200 objects", () => {
        const scene: ISceneVariables<ISceneObject> = sceneBuilder.generateScene(sceneOptions200);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: ISceneObject) => {

            if (!hasAcceptableRangeScale(element.scale.x) ||
                !hasAcceptableRangeScale(element.scale.y) ||
                !hasAcceptableRangeScale(element.scale.z)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the color format with 10 objects", () => {
        const scene: ISceneVariables<ISceneObject> = sceneBuilder.generateScene(sceneOptions10);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: ISceneObject) => {

            if (!hasAcceptableRangeColor(element.color)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the color format with 200 objects", () => {
        const scene: ISceneVariables<ISceneObject> = sceneBuilder.generateScene(sceneOptions200);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: ISceneObject) => {

            if (!hasAcceptableRangeColor(element.color)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

});

function hasAcceptableRangePosition(value: number): boolean {
    let isAcceptable: boolean = true;

    if (value < 0 || value > 150) {
        isAcceptable = false;
    }

    return isAcceptable;
}

function hasAcceptableRangeAngle(value: number): boolean {
    let isAcceptable: boolean = true;
    if (value < 0 || value > Math.PI * 3) {
        isAcceptable = false;
    }

    return isAcceptable;
}

function hasAcceptableRangeScale(value: number): boolean {
    let isAcceptable: boolean = true;
    if (value < 2 || value > 8) {
        isAcceptable = false;
    }

    return isAcceptable;
}

function hasAcceptableRangeColor(value: string): boolean {
    const correctHex:   string = "0x" + value.substring(1);
    const newValue:     number =  parseInt(correctHex, 16);

    let isAcceptable: boolean = true;
    if (newValue < 0 || newValue > 16777215) {
        isAcceptable = false;
    }

    return isAcceptable;
}
