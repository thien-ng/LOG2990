import * as THREE from "three";
import { mock } from "ts-mockito";
import { IAxisValues, ISceneObject, SceneObjectType } from "../../../../../../../common/communication/iSceneObject";
import { ThreejsGenerator } from "./threejs-generator";

// tslint:disable:no-any

let threejsGenerator: ThreejsGenerator;
let scene: THREE.Scene;
let sceneObject: ISceneObject;
let iAxisValues: IAxisValues;

beforeEach(() => {
    scene = mock(THREE.Scene);
    threejsGenerator = new ThreejsGenerator(scene);
    iAxisValues = {x: 1, y: 1, z: 1};
    sceneObject = {
        type: SceneObjectType.Sphere,
        position: iAxisValues,
        rotation: iAxisValues,
        color: "#ffffff",
        scale: iAxisValues,
    };
});

describe("Tests on ThreejsGenerator", () => {

    it("should generate sphere when initiateObject is called", () => {

        const spiedScene: any = spyOn<any>(scene, "add");
        threejsGenerator.initiateObject(sceneObject);

        expect(spiedScene).toHaveBeenCalled();
    });

    it("should generate cube when initiateObject is called", () => {

        sceneObject.type = SceneObjectType.Cube;
        const spiedScene: any = spyOn<any>(scene, "add");
        threejsGenerator.initiateObject(sceneObject);

        expect(spiedScene).toHaveBeenCalled();
    });

    it("should generate cone when initiateObject is called", () => {

        sceneObject.type = SceneObjectType.Cone;
        const spiedScene: any = spyOn<any>(scene, "add");
        threejsGenerator.initiateObject(sceneObject);

        expect(spiedScene).toHaveBeenCalled();
    });

    it("should generate cylinder when initiateObject is called", () => {

        sceneObject.type = SceneObjectType.Cylinder;
        const spiedScene: any = spyOn<any>(scene, "add");
        threejsGenerator.initiateObject(sceneObject);

        expect(spiedScene).toHaveBeenCalled();
    });

    it("should generate triangular pyramid when initiateObject is called", () => {

        sceneObject.type = SceneObjectType.TriangularPyramid;
        const spiedScene: any = spyOn<any>(scene, "add");
        threejsGenerator.initiateObject(sceneObject);

        expect(spiedScene).toHaveBeenCalled();
    });

});
