import * as THREE from "three";
import { mock, when } from "ts-mockito";
import { IAxisValues, ISceneObject, SceneObjectType } from "../../../../../../../common/communication/iSceneObject";
import { ThreejsGenerator } from "./threejs-generator";

// tslint:disable:no-any

let threejsGenerator:   ThreejsGenerator;
let scene:              THREE.Scene;
let sceneObject:        ISceneObject;
let iAxisValues:        IAxisValues;
let sceneIdById:        Map<number, number>;
let idBySceneId:        Map<number, number>;
let originalColorById:  Map<number, string>;
let opacityById:        Map<number, number>;
beforeEach(() => {
    sceneIdById             = new Map<number, number>();
    idBySceneId             = new Map<number, number>();
    originalColorById       = new Map<number, string>();
    opacityById             = new Map<number, number>();
    scene                   = mock(THREE.Scene);
    threejsGenerator        = new ThreejsGenerator(scene, sceneIdById, originalColorById, idBySceneId, opacityById);
    iAxisValues             = { x: 1, y: 1, z: 1 };
    sceneObject             = {
        id:         1,
        type:       SceneObjectType.Sphere,
        position:   iAxisValues,
        rotation:   iAxisValues,
        color:      "#ffffff",
        scale:      iAxisValues,
        hidden:     true,
    };
});

describe("Tests on ThreejsGenerator", () => {

    it("should generate sphere when initiateObject is called", () => {
        const spiedScene: any = spyOn<any>(threejsGenerator, "generateSphere");
        threejsGenerator.initiateObject(sceneObject);

        expect(spiedScene).toHaveBeenCalled();
    });

    it("should generate sphere with 0 opacity when initiateObject is called", () => {
        const spiedScene: any = spyOn<any>(threejsGenerator, "generateSphere");
        sceneObject.hidden = false;
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

    it("should remove an object from scene", () => {
        sceneIdById.set(1, 1);
        const spiedScene:  any = spyOn<any>(scene, "remove");
        const objectFound: any = new THREE.Object3D();

        when(scene.getObjectById(1)).thenReturn(objectFound);

        threejsGenerator.deleteObject(1);

        expect(spiedScene).toHaveBeenCalled();
    });

    it("should change color of an object from scene", () => {
        originalColorById.set(1, "#FFFFFF");
        sceneIdById.set(1, 1);
        const spiedMap:    any = spyOn<any>(originalColorById, "set");
        const objectFound: any = new THREE.Object3D();

        when(scene.getObjectById(1)).thenReturn(objectFound);

        threejsGenerator.changeObjectColor(1, "#FFFFFF");

        expect(spiedMap).toHaveBeenCalled();
    });

});
