import * as THREE from "three";
// import { anything, mock, when } from "ts-mockito";
import { mock } from "ts-mockito";

import { ActionType, ISceneObjectUpdate } from "../../../../../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../../../../../common/communication/iSceneObject";

import { ThreejsGenerator } from "./threejs-generator";
import { ThreejsRaycast } from "./threejs-raycast";
import { ThreejsThemeGenerator } from "./threejs-themeGenerator";

// tslint:disable:no-any no-magic-numbers max-file-line-count max-line-length

const idBySceneId: Map<number, number> = new Map<number, number>();
idBySceneId.set(1, 1);
const sceneIdById: Map<number, number> = new Map<number, number>();
sceneIdById.set(10, 1);
const opacityById: Map<number, number> =  new Map<number, number>();
opacityById.set(3, 3);
const originalColorById: Map<number, string> = new Map<number, string>();
originalColorById.set(1, "blue");

const objectUpdateSceneObject: ISceneObjectUpdate<ISceneObject> = {
    actionToApply:  ActionType.ADD,
    sceneObject:    {
        id:         1,
        type:       1,
        position:   {x: 1, y: 1, z: 1},
        rotation:   {x: 1, y: 1, z: 1},
        color:      "#FFFFFF",
        scale:      {x: 1, y: 1, z: 1},
        hidden:     true,
    },
};


let camera:                     THREE.PerspectiveCamera;
let renderer:                   THREE.WebGLRenderer;
let scene:                      THREE.Scene;
let raycaster:                  THREE.Raycaster;
let threejsRaycast:             ThreejsRaycast;
let threejsGeneratorGeometric:  ThreejsGenerator;
let threejsGeneratorTheme:      ThreejsThemeGenerator;
const modelsByName:             Map<string, THREE.Object3D> = new Map<string, THREE.Object3D>();

describe("threejs-raycast tests", () => {

    beforeEach(() => {
        camera                      = mock(THREE.PerspectiveCamera);
        renderer                    = mock(THREE.WebGLRenderer);
        scene                       = mock(THREE.Scene);
        threejsGeneratorGeometric   = mock(ThreejsGenerator);
        threejsGeneratorTheme       = mock(ThreejsThemeGenerator);
        threejsRaycast              = new ThreejsRaycast(camera, renderer, scene);
    });

    it("should set maps of idBySceneId", () => {
        threejsRaycast.setMaps(idBySceneId, sceneIdById);
        expect(threejsRaycast["idBySceneId"]).toEqual(idBySceneId);
    });

    it("should set threeGenetor", () => {
        threejsRaycast.setThreeGenerator(threejsGeneratorGeometric);
        expect(threejsRaycast["threejsGenerator"]).toEqual(threejsGeneratorGeometric);
    });

    it("should not dectect any object", () => {
        threejsRaycast.setMaps(idBySceneId, sceneIdById);
        threejsRaycast.setThreeGenerator(threejsGeneratorGeometric);

        const mouseEvent: any = mock(MouseEvent);
        raycaster = mock(THREE.Raycaster);
        threejsRaycast["raycaster"] = raycaster;
        const result: number = threejsRaycast.detectObject(mouseEvent);

        expect(result).toBe(-1);
    });

    it("should dectect an object", () => {

        const spy: any = spyOn<any>(threejsRaycast["raycaster"], "setFromCamera");
        threejsRaycast.setMaps(idBySceneId, sceneIdById);
        threejsRaycast.setThreeGenerator(threejsGeneratorGeometric);

        const mouseEvent: any = mock(MouseEvent);

        const intersection: THREE.Intersection[] = [{
            distance:   10,
            point:      new THREE.Vector3(1, 1, 1),
            object:     new THREE.Object3D(),
        }];
        when(raycaster.intersectObjects(anything())).thenReturn(intersection);

        threejsRaycast.detectObject(mouseEvent);

        expect(spy).toHaveBeenCalled();
    });

    it("should not call deleteObject from threejsGenerator if action type is ADD", () => {
        threejsRaycast.setThreeGenerator(threejsGeneratorGeometric);

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "deleteObject");
        threejsRaycast.updateSceneWithNewObject(objectUpdateSceneObject);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call changeObjectColor from threejsGenerator if action type is ADD", () => {
        threejsRaycast.setThreeGenerator(threejsGeneratorGeometric);

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "changeObjectColor");
        threejsRaycast.updateSceneWithNewObject(objectUpdateSceneObject);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call initiateObject from threejsGenerator if action type is DELETE", () => {
        threejsRaycast.setThreeGenerator(threejsGeneratorGeometric);

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "initiateObject");
        objectUpdateSceneObject.actionToApply = ActionType.DELETE;
        threejsRaycast.updateSceneWithNewObject(objectUpdateSceneObject);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call changeObjectColor from threejsGenerator if action type is DELETE", () => {
        threejsRaycast.setThreeGenerator(threejsGeneratorGeometric);

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "changeObjectColor");
        objectUpdateSceneObject.actionToApply = ActionType.DELETE;
        threejsRaycast.updateSceneWithNewObject(objectUpdateSceneObject);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call initiateObject from threejsGenerator if action type is CHANGE_COLOR", () => {
        threejsRaycast.setThreeGenerator(threejsGeneratorGeometric);

        objectUpdateSceneObject.actionToApply = ActionType.CHANGE_COLOR;

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "initiateObject");

        threejsRaycast.updateSceneWithNewObject(objectUpdateSceneObject);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call deleteObject from threejsGenerator if action type is CHANGE_COLOR", () => {
        threejsRaycast.setThreeGenerator(threejsGeneratorGeometric);

        objectUpdateSceneObject.actionToApply = ActionType.CHANGE_COLOR;

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "deleteObject");

        threejsRaycast.updateSceneWithNewObject(objectUpdateSceneObject);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call initiateObject from threejsGenerator if action type is NO_ACTION_REQUIRED", () => {
        threejsRaycast.setMaps(idBySceneId, sceneIdById);
        threejsRaycast.setThreeGenerator(threejsGeneratorGeometric);

        objectUpdateSceneObject.actionToApply = ActionType.NO_ACTION_REQUIRED;

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "initiateObject");

        threejsRaycast.updateSceneWithNewObject(objectUpdateSceneObject);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call deleteObject from threejsGenerator if action type is NO_ACTION_REQUIRED", () => {
        threejsRaycast.setMaps(idBySceneId, sceneIdById);
        threejsRaycast.setThreeGenerator(threejsGeneratorGeometric);

        objectUpdateSceneObject.actionToApply = ActionType.NO_ACTION_REQUIRED;

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "deleteObject");

        threejsRaycast.updateSceneWithNewObject(objectUpdateSceneObject);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call changeObjectColor from threejsGenerator if action type is NO_ACTION_REQUIRED", () => {
        threejsRaycast.setMaps(idBySceneId, sceneIdById);
        threejsRaycast.setThreeGenerator(threejsGeneratorGeometric);

        objectUpdateSceneObject.actionToApply = ActionType.NO_ACTION_REQUIRED;

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "changeObjectColor");

        threejsRaycast.updateSceneWithNewObject(objectUpdateSceneObject);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call initiateObject from threejsGenerator if no object is passed as reference", () => {
        threejsRaycast.setThreeGenerator(threejsGeneratorGeometric);

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "initiateObject");
        objectUpdateSceneObject.sceneObject    = undefined;
        threejsRaycast.updateSceneWithNewObject(objectUpdateSceneObject);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call deleteObject from threejsGenerator if no object is passed as reference", () => {
        threejsRaycast.setThreeGenerator(threejsGeneratorGeometric);

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "deleteObject");

        objectUpdateSceneObject.sceneObject    = undefined;
        threejsRaycast.updateSceneWithNewObject(objectUpdateSceneObject);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call changeObjectColor from threejsGenerator if no object is passed as reference", () => {
        threejsRaycast.setThreeGenerator(threejsGeneratorGeometric);

        objectUpdateSceneObject.sceneObject    = undefined;

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "changeObjectColor");

        threejsRaycast.updateSceneWithNewObject(objectUpdateSceneObject);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should set attribute threejsThemeGenerator equal to parameter passed to setThreeGenerator()", () => {
        const threejsThemeGeneratorMock:  ThreejsThemeGenerator = new ThreejsThemeGenerator(scene, sceneIdById, idBySceneId, opacityById, modelsByName);
        threejsRaycast["threejsThemeGenerator"] = threejsGeneratorTheme;
        threejsRaycast["isTheme"] = true;
        threejsRaycast.setThreeGenerator(threejsThemeGeneratorMock);

        expect(threejsRaycast["threejsThemeGenerator"]).toBe(threejsThemeGeneratorMock);
    });

    it("should return parent object3 as parent object", () => {
        threejsRaycast.setThreeGenerator(threejsGeneratorTheme);

        const object1: THREE.Object3D = new THREE.Object3D();
        const object2: THREE.Object3D = new THREE.Object3D();
        const object3: THREE.Object3D = new THREE.Object3D();

        object1.parent = object2;
        object2.parent = object3;
        object3.parent = scene;

        expect(threejsRaycast.getParentObject(object1) as THREE.Object3D).toBe(object3);
    });

    it("should not return object3 as parent if none of the objects are connected to scene", () => {
        threejsRaycast.setThreeGenerator(threejsGeneratorTheme);

        const object1: THREE.Object3D = new THREE.Object3D();
        const object2: THREE.Object3D = new THREE.Object3D();
        const object3: THREE.Object3D = new THREE.Object3D();

        object1.parent = object2;
        object2.parent = object3;

        expect(threejsRaycast.getParentObject(object1) as THREE.Object3D).not.toBe(object3);
    });

    it("should return null if the object is null", () => {
        threejsRaycast.setMaps(idBySceneId, sceneIdById);
        threejsRaycast.setThreeGenerator(threejsGeneratorTheme);

        const object1: THREE.Object3D = new THREE.Object3D();
        const object2: THREE.Object3D = new THREE.Object3D();
        const object3: THREE.Object3D = new THREE.Object3D();

        object1.parent = object2;
        object2.parent = object3;

        expect(threejsRaycast.getParentObject(object3.parent as THREE.Object3D) as THREE.Object3D).not.toBe(object3);
    });

    it("should return null if the object is null", () => {
        threejsRaycast.setMaps(idBySceneId, sceneIdById);
        threejsRaycast.setThreeGenerator(threejsGeneratorTheme);

        const object1: THREE.Object3D = new THREE.Object3D();
        const object2: THREE.Object3D = new THREE.Object3D();
        const object3: THREE.Object3D = new THREE.Object3D();

        object1.parent = object2;
        object2.parent = object3;

        expect(threejsRaycast.getParentObject(object3.parent as THREE.Object3D) as THREE.Object3D).not.toBe(object3);

    });

    it("should display object to update to scene Theme", () => {
        const spy: any = spyOn<any>(threejsRaycast, "displayObject").and.callFake(() => {return; });
        threejsRaycast.setMaps(idBySceneId, sceneIdById);
        threejsRaycast["isTheme"] = true;
        threejsRaycast["threejsThemeGenerator"] = (threejsGeneratorTheme);

        threejsRaycast.updateSceneWithNewObject(objectUpdateMesh);

        expect(spy).toHaveBeenCalled();
    });

    it("should call changeObjectColor() if isTheme is true", () => {
        const param: ISceneObjectUpdate<IMesh> = {
            sceneObject: {id: 1} as IMesh,
        } as ISceneObjectUpdate<IMesh>;

        threejsRaycast["threejsThemeGenerator"] = mock(ThreejsThemeGenerator);
        const spy: any = spyOn<any>(threejsRaycast["threejsThemeGenerator"], "changeObjectColor");

        threejsRaycast["isTheme"] = true;
        threejsRaycast["changeObjectColor"](param);

        expect(spy).toHaveBeenCalled();
    });

    it("should ignore object and not display update to scene theme", () => {
        const spy: any = spyOn<any>(threejsRaycast, "displayObject");
        threejsRaycast["isTheme"] = true;

        const objectUpdateMeshWrong: ISceneObjectUpdate<IMesh> = {
            actionToApply:  ActionType.ADD,
        };

        threejsRaycast.updateSceneWithNewObject(objectUpdateMeshWrong);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should delete object to update to scene Theme", () => {
        const spy: any = spyOn<any>(threejsRaycast, "deleteObject");

        objectUpdateMesh.actionToApply = ActionType.DELETE;
        threejsRaycast.updateSceneWithNewObject(objectUpdateMesh);

        expect(spy).toHaveBeenCalled();
    });

    it("should change object to update to scene Theme", () => {
        const spy: any = spyOn<any>(threejsRaycast, "changeObjectColor");

        objectUpdateMesh.actionToApply = ActionType.CHANGE_COLOR;
        threejsRaycast.updateSceneWithNewObject(objectUpdateMesh);

        expect(spy).toHaveBeenCalled();
    });

    it("should set attribute threejsThemeGenerator equal to parameter passed to setThreeGenerator()", () => {
        const threejsThemeGeneratorMock:  ThreejsThemeGenerator = new ThreejsThemeGenerator(scene, sceneIdById, idBySceneId, opacityById, modelsByName);
        threejsRaycast.setThreeGenerator(threejsThemeGeneratorMock);

        expect(threejsRaycast["threejsThemeGenerator"]).toBe(threejsThemeGeneratorMock);
    });

});
