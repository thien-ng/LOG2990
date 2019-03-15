import * as THREE from "three";
import { mock } from "ts-mockito";
import { IAxisValues, ISceneObject, SceneObjectType } from "../../../../../../../common/communication/iSceneObject";
import { ThreejsGenerator } from "./threejs-generator";

// tslint:disable:no-any

let threejsGenerator:   ThreejsGenerator;
let scene:              THREE.Scene;
let sceneObject:        ISceneObject;
let iAxisValues:        IAxisValues;
let modifiedIdBySceneId:        Map<number, number>;
let mapColorByOriginalId:     Map<number, string>;
beforeEach(() => {
    modifiedIdBySceneId     = new Map<number, number>();
    mapColorByOriginalId    = new Map<number, string>();
    scene                   = mock(THREE.Scene);
    threejsGenerator        = new ThreejsGenerator(scene, modifiedIdBySceneId, mapColorByOriginalId);
    iAxisValues             = { x: 1, y: 1, z: 1 };
    sceneObject             = {
        id:         1,
        type:       SceneObjectType.Sphere,
        position:   iAxisValues,
        rotation:   iAxisValues,
        color:      "#ffffff",
        scale:      iAxisValues,
    };
});

describe("Tests on ThreejsGenerator", () => {

    it("should generate sphere when initiateObject is called", () => {
        const spiedScene: any = spyOn<any>(threejsGenerator, "generateSphere");
        threejsGenerator.initiateObject(sceneObject);

        expect(spiedScene).toHaveBeenCalled();
    });

    it("should generate cube when initiateObject is called", () => {
        sceneObject.type        = SceneObjectType.Cube;
        const spiedScene: any   = spyOn<any>(threejsGenerator, "generateCube");

        threejsGenerator.initiateObject(sceneObject);

        expect(spiedScene).toHaveBeenCalled();
    });

    it("should generate cone when initiateObject is called", () => {
        sceneObject.type        = SceneObjectType.Cone;
        const spiedScene: any   = spyOn<any>(threejsGenerator, "generateCone");

        threejsGenerator.initiateObject(sceneObject);

        expect(spiedScene).toHaveBeenCalled();
    });

    it("should generate cylinder when initiateObject is called", () => {
        sceneObject.type        = SceneObjectType.Cylinder;
        const spiedScene: any   = spyOn<any>(threejsGenerator, "generateCylinder");

        threejsGenerator.initiateObject(sceneObject);

        expect(spiedScene).toHaveBeenCalled();
    });

    it("should generate triangular pyramid when initiateObject is called", () => {
        sceneObject.type        = SceneObjectType.TriangularPyramid;
        const spiedScene: any   = spyOn<any>(threejsGenerator, "generateTriangularPyramid");

        threejsGenerator.initiateObject(sceneObject);

        expect(spiedScene).toHaveBeenCalled();
    });

    it("should add triangular pyramid when addObjectToScene is called", () => {
        sceneObject.type        = SceneObjectType.TriangularPyramid;
        const spiedScene: any   = spyOn<any>(scene, "add");

        threejsGenerator.initiateObject(sceneObject);

        expect(spiedScene).toHaveBeenCalled();
    });

    it("should add cylinder when addObjectToScene is called", () => {
        sceneObject.type        = SceneObjectType.Cylinder;
        const spiedScene: any   = spyOn<any>(scene, "add");

        threejsGenerator.initiateObject(sceneObject);

        expect(spiedScene).toHaveBeenCalled();
    });

    it("should add cone when addObjectToScene is called", () => {
        sceneObject.type        = SceneObjectType.Cone;
        const spiedScene: any   = spyOn<any>(scene, "add");

        threejsGenerator.initiateObject(sceneObject);

        expect(spiedScene).toHaveBeenCalled();
    });

    it("should add cube when addObjectToScene is called", () => {
        sceneObject.type        = SceneObjectType.Cube;
        const spiedScene: any   = spyOn<any>(scene, "add");

        threejsGenerator.initiateObject(sceneObject);

        expect(spiedScene).toHaveBeenCalled();
    });

    it("should add sphere when addObjectToScene is called", () => {
        sceneObject.type        = SceneObjectType.Sphere;
        const spiedScene: any   = spyOn<any>(scene, "add");

        threejsGenerator.initiateObject(sceneObject);

        expect(spiedScene).toHaveBeenCalled();
    });
});
