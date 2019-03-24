import * as chai from "chai";
import * as spies from "chai-spies";
import { ISceneEntity, ITheme } from "../../../../common/communication/ITheme";
import { IMesh } from "../../../../common/communication/iSceneObject";
import { ISceneOptions, SceneType } from "../../../../common/communication/iSceneOptions";
import { IMeshInfo, ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { SceneBuilderTheme } from "../../services/scene/scene-builder-theme";

// tslint:disable:no-any no-magic-numbers no-any only-arrow-functions max-file-line-count

const meshInfo: IMeshInfo = {
    GLTFUrl:    "url",
    uuid:       "uuid",
};

const entity: ISceneEntity = {
    name:               "name",
    meshInfos:          [meshInfo, meshInfo],
    baseSize:           1,
    radius:             1,
    presenceRatio:      1,
};

const theme: ITheme = {
    name:                   "name",
    sceneEntities:          [entity, entity],
    floorEntity:            entity,
    backgroundColor:        "#FFFFFF",
    startCameraPosition:    {x: 1, y: 1, z: 1},
    generationArea:         {
        minPosition: {x: -5000, y: -5000, z: -5000},
        maxPosition: {x: 5000, y: 5000, z: 5000},
    },
};

let sceneBuilder: SceneBuilderTheme;

describe("Scene builder theme tests", () => {

    const sceneOptions10: ISceneOptions = {
        sceneName:              "10 objects",
        sceneType:              SceneType.Thematic,
        sceneObjectsQuantity:   10,
        selectedOptions:        [true, true, true],
    };

    const sceneOptions100: ISceneOptions = {
        sceneName:              "200 objects",
        sceneType:              SceneType.Thematic,
        sceneObjectsQuantity:   100,
        selectedOptions:        [true, true, true],
    };

    const sceneOptions200: ISceneOptions = {
        sceneName:              "200 objects",
        sceneType:              SceneType.Thematic,
        sceneObjectsQuantity:   200,
        selectedOptions:        [true, true, true],
    };

    beforeEach(() => {
        chai.use(spies);
        sceneBuilder = new SceneBuilderTheme();
    });

    it("should generate a SceneObject[] of length 10", () => {
        const scene: ISceneVariables<IMesh> = sceneBuilder.generateScene(sceneOptions10, theme);
        chai.expect(scene.sceneObjects.length).equal(10);
    });

    it("should generate a SceneObject[] of length 100", () => {
        const scene: ISceneVariables<IMesh> = sceneBuilder.generateScene(sceneOptions100, theme);
        chai.expect(scene.sceneObjects.length).equal(100);
    });

    it("should generate a SceneObject[] of length 200", () => {
        const scene: ISceneVariables<IMesh> = sceneBuilder.generateScene(sceneOptions200, theme);
        chai.expect(scene.sceneObjects.length).equal(200);
    });

    it("should generate a SceneObject[] containing the x,y,z in acceptable position range with 10 objects", () => {
        const scene: ISceneVariables<IMesh> = sceneBuilder.generateScene(sceneOptions10, theme);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: IMesh) => {

            if (!hasAcceptableRangePosition(element.position.x) ||
                !hasAcceptableRangePosition(element.position.y) ||
                !hasAcceptableRangePosition(element.position.z)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the x,y,z in acceptable position range with 100 objects", () => {
        const scene: ISceneVariables<IMesh> = sceneBuilder.generateScene(sceneOptions100, theme);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: IMesh) => {

            if (!hasAcceptableRangePosition(element.position.x) ||
                !hasAcceptableRangePosition(element.position.y) ||
                !hasAcceptableRangePosition(element.position.z)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the x,y,z in acceptable position range with 200 objects", () => {
        const scene: ISceneVariables<IMesh> = sceneBuilder.generateScene(sceneOptions200, theme);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: IMesh) => {

            if (!hasAcceptableRangePosition(element.position.x) ||
                !hasAcceptableRangePosition(element.position.y) ||
                !hasAcceptableRangePosition(element.position.z)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the x,y,z in acceptable angle range with 10 objects", () => {
        const scene: ISceneVariables<IMesh> = sceneBuilder.generateScene(sceneOptions10, theme);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: IMesh) => {

            if (!hasAcceptableRangeAngle(element.rotation.x, element.rotation.y, element.rotation.z)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the x,y,z in acceptable angle range with 100 objects", () => {
        const scene: ISceneVariables<IMesh> = sceneBuilder.generateScene(sceneOptions100, theme);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: IMesh) => {

            if (!hasAcceptableRangeAngle(element.rotation.x, element.rotation.y, element.rotation.z)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the x,y,z in acceptable angle range with 200 objects", () => {
        const scene: ISceneVariables<IMesh> = sceneBuilder.generateScene(sceneOptions200, theme);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: IMesh) => {

            if (!hasAcceptableRangeAngle(element.rotation.x, element.rotation.y, element.rotation.z)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the correct MeshInfo with 10 objects", () => {
        const scene: ISceneVariables<IMesh> = sceneBuilder.generateScene(sceneOptions10, theme);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: IMesh) => {

            if (!hasCorrectMeshInfo(element.meshInfo, theme.sceneEntities[0])) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the correct MeshInfo with 100 objects", () => {
        const scene: ISceneVariables<IMesh> = sceneBuilder.generateScene(sceneOptions100, theme);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: IMesh) => {

            if (!hasCorrectMeshInfo(element.meshInfo, theme.sceneEntities[0])) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the correct MeshInfo with 200 objects", () => {
        const scene: ISceneVariables<IMesh> = sceneBuilder.generateScene(sceneOptions200, theme);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: IMesh) => {

            if (!hasCorrectMeshInfo(element.meshInfo, theme.sceneEntities[0])) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the x,y,z in acceptable scaleFactor range with 10 objects", () => {
        const scene: ISceneVariables<IMesh> = sceneBuilder.generateScene(sceneOptions10, theme);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: IMesh) => {

            if (!hasCorrectScaleFactor(element.scaleFactor)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the x,y,z in acceptable scaleFactor range with 100 objects", () => {
        const scene: ISceneVariables<IMesh> = sceneBuilder.generateScene(sceneOptions100, theme);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: IMesh) => {

            if (!hasCorrectScaleFactor(element.scaleFactor)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

    it("should generate a SceneObject[] containing the x,y,z in acceptable scaleFactor range with 200 objects", () => {
        const scene: ISceneVariables<IMesh> = sceneBuilder.generateScene(sceneOptions200, theme);

        let isAcceptable: boolean = true;

        scene.sceneObjects.forEach((element: IMesh) => {

            if (!hasCorrectScaleFactor(element.scaleFactor)) {
                isAcceptable = false;
            }

        });

        chai.expect(isAcceptable).to.equal(true);
    });

});

function hasAcceptableRangePosition(value: number): boolean {
    return !(value < -5000 || value > 5000);
}

function hasAcceptableRangeAngle(x: number, y: number, z: number): boolean {
    return !(x !== 0  || z !== 0 || y < 0 || y > Math.PI * 3);
}

function hasCorrectMeshInfo(info: IMeshInfo, sceneEntity: ISceneEntity): boolean {
    return !(info.GLTFUrl !== sceneEntity.meshInfos[0].GLTFUrl ||
        info.uuid !== sceneEntity.meshInfos[0].uuid);
}

function hasCorrectScaleFactor(value: number): boolean {
    return !(value < 0.5 || value > 1.5);
}
