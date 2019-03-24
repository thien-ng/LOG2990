import * as THREE from "three";
import { mock } from "ts-mockito";
import { IMesh } from "../../../../../../../common/communication/iSceneObject";
import { ThreejsThemeGenerator } from "./threejs-themeGenerator";

// tslint:disable:no-any no-magic-numbers

const mesh: IMesh = {
    id:             1,
    meshInfo:       {
        GLTFUrl:    "url",
        uuid:       "uuid",
    },
    name:           "name",
    radius:         1,
    position:       {x: 1, y: 1, z: 1},
    rotation:       {x: 1, y: 1, z: 1},
    scaleFactor:    1,
    hidden:         true,
};

const sceneIdById:           Map<number, number> = new Map<number, number>();
const idBySceneId:           Map<number, number> = new Map<number, number>();
const opacityById:           Map<number, number> = new Map<number, number>();
const modelsByName:          Map<string, THREE.Object3D> = new Map<string, THREE.Object3D>();

const object1: THREE.Object3D = new THREE.Object3D();
object1.position.set(5, 5, 5);

sceneIdById.set(1, 1);
idBySceneId.set(1, 1);
opacityById.set(1, 0);
modelsByName.set("uuid", object1);

let threejsThemeGenerator:      ThreejsThemeGenerator;
let scene:                      THREE.Scene;

describe("ThreejsThemeGenerator Tests", () => {

    beforeEach(() => {
        scene = mock(THREE.Scene);
        threejsThemeGenerator = new ThreejsThemeGenerator(scene, sceneIdById, idBySceneId, opacityById, modelsByName);
    });

    it("should initiate new object 3D when object has multiple mesh children", () => {
        const spy: any = spyOn<any>(threejsThemeGenerator, "initObject3D").and.callThrough();
        const object2: THREE.Mesh     = new THREE.Mesh();
        const object3: THREE.Mesh     = new THREE.Mesh();

        object1.children = [object2, object3];
        threejsThemeGenerator.initiateObject(mesh, modelsByName);

        expect(spy).toHaveBeenCalled();
    });

    it("should have set new position to referenced object", () => {
        const object2: THREE.Mesh = new THREE.Mesh();
        object2.position.set(10, 10, 10);

        threejsThemeGenerator["setObjectPosition"](object2, {x: 1, y: 1, z: 1});

        let isChanged: boolean = false;

        if (object2.position.x === 1 &&
            object2.position.y === 1 &&
            object2.position.z === 1) {
                isChanged = true;
        }

        expect(isChanged).toBe(true);
    });

    it("should have set new orientation to referenced object", () => {
        const object2: THREE.Mesh = new THREE.Mesh();
        object2.rotation.set(10, 10, 10);

        threejsThemeGenerator["setObjectPosition"](object2, {x: 1, y: 1, z: 1});

        let isChanged: boolean = false;

        if (object2.position.x === 1 &&
            object2.position.y === 1 &&
            object2.position.z === 1) {
                isChanged = true;
        }

        expect(isChanged).toBe(true);
    });

    it("should have set new scale to referenced object", () => {
        const object2: THREE.Mesh = new THREE.Mesh();
        object2.scale.set(10, 10, 10);

        threejsThemeGenerator["setObjectPosition"](object2, {x: 1, y: 1, z: 1});

        let isChanged: boolean = false;

        if (object2.position.x === 1 &&
            object2.position.y === 1 &&
            object2.position.z === 1) {
                isChanged = true;
        }

        expect(isChanged).toBe(true);
    });

    it("should initiate new object 3D when object has multiple mesh children", () => {
        const spy: any = spyOn<any>(threejsThemeGenerator, "initObject3D").and.callThrough();
        const testObject1: any = new THREE.Object3D();
        const testObject2: any = new THREE.Object3D();

        object1.children = [testObject1, testObject2];
        threejsThemeGenerator.initiateObject(mesh, modelsByName);
        expect(spy).toHaveBeenCalled();
    });

    it("should delete object from scene by id given in parameter", () => {
        const testObject1:  any = new THREE.Object3D();
        const newScene:     any = new THREE.Scene();
        const spy: any = spyOn<any>(newScene, "remove").and.callThrough();

        sceneIdById.set(1, testObject1.id);
        newScene.children = [testObject1];
        threejsThemeGenerator = new ThreejsThemeGenerator(newScene, sceneIdById, idBySceneId, opacityById, modelsByName);

        threejsThemeGenerator.deleteObject(1);
        expect(spy).toHaveBeenCalled();
    });

    it("should change object color from scene by mesh given in parameter", () => {
        const testObject1:  any = new THREE.Object3D();
        const newScene:     any = new THREE.Scene();

        sceneIdById.set(1, testObject1.id);
        newScene.children = [testObject1];
        threejsThemeGenerator = new ThreejsThemeGenerator(newScene, sceneIdById, idBySceneId, opacityById, modelsByName);
        const spy: any = spyOn<any>(threejsThemeGenerator, "initiateObject").and.callThrough();

        threejsThemeGenerator.changeObjectColor(mesh);
        expect(spy).toHaveBeenCalled();
    });

    it("should initiate new object 3D when object has multiple mesh children with not hidden material", () => {
        const spy: any = spyOn<any>(threejsThemeGenerator, "initObject3D").and.callThrough();
        const testObject1: any = new THREE.Object3D();
        const testObject2: any = new THREE.Object3D();

        const specialMesh: IMesh = {
            id:             1,
            meshInfo:       {
                GLTFUrl:    "url",
                uuid:       "uuid",
            },
            name:           "name",
            radius:         1,
            position:       {x: 1, y: 1, z: 1},
            rotation:       {x: 1, y: 1, z: 1},
            scaleFactor:    1,
            hidden:         false,
        };

        object1.children = [testObject1, testObject2];
        threejsThemeGenerator.initiateObject(specialMesh, modelsByName);
        expect(spy).toHaveBeenCalled();
    });

    it("should initiate new object 3D with multiple material", () => {
        const spy: any = spyOn<any>(threejsThemeGenerator, "initObject3D").and.callThrough();
        const testObject1: THREE.Mesh = new THREE.Mesh();
        const testObject2: THREE.Mesh = new THREE.Mesh();

        testObject1.material = [new THREE.Material(), new THREE.Material()];

        object1.children = [testObject1, testObject2];
        threejsThemeGenerator.initiateObject(mesh, modelsByName);
        expect(spy).toHaveBeenCalled();
    });

    it("should initiate new object 3D with multiple children", () => {
        const spy: any = spyOn<any>(threejsThemeGenerator, "initObject3D").and.callThrough();
        const testObject1: THREE.Mesh = new THREE.Mesh();
        const testObject2: THREE.Mesh = new THREE.Mesh();

        object1.children = [testObject1, testObject2];
        threejsThemeGenerator.initiateObject(mesh, modelsByName);
        expect(spy).toHaveBeenCalled();
    });

    it("should get opacity map by id", () => {
        const map: any = new Map<number, number>();
        threejsThemeGenerator["opacityById"] = map;
        expect(threejsThemeGenerator.getOpacityById()).toBe(map);
    });

});
