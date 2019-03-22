import * as THREE from "three";
import { anything, mock, when } from "ts-mockito";
import { ActionType, ISceneObjectUpdate } from "../../../../../../../common/communication/iGameplay";
import { ThreejsGenerator } from "./threejs-generator";
import { ThreejsRaycast } from "./threejs-raycast";

// tslint:disable:no-any no-magic-numbers

const idBySceneId: Map<number, number> = new Map<number, number>();
idBySceneId.set(1, 1);

const objectUpdate: ISceneObjectUpdate = {
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

let camera:             THREE.PerspectiveCamera;
let renderer:           THREE.WebGLRenderer;
let scene:              THREE.Scene;
let threejsRaycast:     ThreejsRaycast;
let threejsGenerator:   ThreejsGenerator;
let raycaster:          THREE.Raycaster;

describe("threejs-raycast tests", () => {

    beforeEach(() => {
        camera              = mock(THREE.PerspectiveCamera);
        renderer            = mock(THREE.WebGLRenderer);
        scene               = mock(THREE.Scene);
        threejsGenerator    = mock(ThreejsGenerator);
        threejsRaycast      = new ThreejsRaycast(camera, renderer, scene);
    });

    it("should set maps of idBySceneId", () => {
        threejsRaycast.setMaps(idBySceneId);
        expect(threejsRaycast["idBySceneId"]).toEqual(idBySceneId);
    });

    it("should set threeGenetor", () => {
        threejsRaycast.setThreeGenerator(threejsGenerator);
        expect(threejsRaycast["threejsGenerator"]).toEqual(threejsGenerator);
    });

    it("should not dectect any object", () => {
        threejsRaycast.setMaps(idBySceneId);
        threejsRaycast.setThreeGenerator(threejsGenerator);

        const mouseEvent: any = mock(MouseEvent);
        raycaster = mock(THREE.Raycaster);
        threejsRaycast["raycaster"] = raycaster;
        const result: number = threejsRaycast.detectObject(mouseEvent);

        expect(result).toBe(-1);
    });

    it("should dectect an object", () => {

        const spy: any = spyOn<any>(threejsRaycast["raycaster"], "setFromCamera");
        threejsRaycast.setMaps(idBySceneId);
        threejsRaycast.setThreeGenerator(threejsGenerator);

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
        threejsRaycast.setMaps(idBySceneId);
        threejsRaycast.setThreeGenerator(threejsGenerator);

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "deleteObject");

        threejsRaycast.updateSceneWithNewObject(objectUpdate);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call changeObjectColor from threejsGenerator if action type is ADD", () => {
        threejsRaycast.setMaps(idBySceneId);
        threejsRaycast.setThreeGenerator(threejsGenerator);

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "changeObjectColor");

        threejsRaycast.updateSceneWithNewObject(objectUpdate);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call initiateObject from threejsGenerator if action type is DELETE", () => {
        threejsRaycast.setMaps(idBySceneId);
        threejsRaycast.setThreeGenerator(threejsGenerator);

        objectUpdate.actionToApply = ActionType.DELETE;

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "initiateObject");

        threejsRaycast.updateSceneWithNewObject(objectUpdate);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call changeObjectColor from threejsGenerator if action type is DELETE", () => {
        threejsRaycast.setMaps(idBySceneId);
        threejsRaycast.setThreeGenerator(threejsGenerator);

        objectUpdate.actionToApply = ActionType.DELETE;

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "changeObjectColor");

        threejsRaycast.updateSceneWithNewObject(objectUpdate);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call initiateObject from threejsGenerator if action type is CHANGE_COLOR", () => {
        threejsRaycast.setMaps(idBySceneId);
        threejsRaycast.setThreeGenerator(threejsGenerator);

        objectUpdate.actionToApply = ActionType.CHANGE_COLOR;

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "initiateObject");

        threejsRaycast.updateSceneWithNewObject(objectUpdate);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call deleteObject from threejsGenerator if action type is CHANGE_COLOR", () => {
        threejsRaycast.setMaps(idBySceneId);
        threejsRaycast.setThreeGenerator(threejsGenerator);

        objectUpdate.actionToApply = ActionType.CHANGE_COLOR;

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "deleteObject");

        threejsRaycast.updateSceneWithNewObject(objectUpdate);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call initiateObject from threejsGenerator if action type is NO_ACTION_REQUIRED", () => {
        threejsRaycast.setMaps(idBySceneId);
        threejsRaycast.setThreeGenerator(threejsGenerator);

        objectUpdate.actionToApply = ActionType.NO_ACTION_REQUIRED;

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "initiateObject");

        threejsRaycast.updateSceneWithNewObject(objectUpdate);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call deleteObject from threejsGenerator if action type is NO_ACTION_REQUIRED", () => {
        threejsRaycast.setMaps(idBySceneId);
        threejsRaycast.setThreeGenerator(threejsGenerator);

        objectUpdate.actionToApply = ActionType.NO_ACTION_REQUIRED;

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "deleteObject");

        threejsRaycast.updateSceneWithNewObject(objectUpdate);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call changeObjectColor from threejsGenerator if action type is NO_ACTION_REQUIRED", () => {
        threejsRaycast.setMaps(idBySceneId);
        threejsRaycast.setThreeGenerator(threejsGenerator);

        objectUpdate.actionToApply = ActionType.NO_ACTION_REQUIRED;

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "changeObjectColor");

        threejsRaycast.updateSceneWithNewObject(objectUpdate);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call initiateObject from threejsGenerator if no object is passed as reference", () => {
        threejsRaycast.setMaps(idBySceneId);
        threejsRaycast.setThreeGenerator(threejsGenerator);

        objectUpdate.actionToApply  = ActionType.NO_ACTION_REQUIRED;
        objectUpdate.sceneObject    = undefined;

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "initiateObject");

        threejsRaycast.updateSceneWithNewObject(objectUpdate);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call deleteObject from threejsGenerator if no object is passed as reference", () => {
        threejsRaycast.setMaps(idBySceneId);
        threejsRaycast.setThreeGenerator(threejsGenerator);

        objectUpdate.actionToApply  = ActionType.NO_ACTION_REQUIRED;
        objectUpdate.sceneObject    = undefined;

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "deleteObject");

        threejsRaycast.updateSceneWithNewObject(objectUpdate);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should not call changeObjectColor from threejsGenerator if no object is passed as reference", () => {
        threejsRaycast.setMaps(idBySceneId);
        threejsRaycast.setThreeGenerator(threejsGenerator);

        objectUpdate.actionToApply  = ActionType.NO_ACTION_REQUIRED;
        objectUpdate.sceneObject    = undefined;

        const spy: any = spyOn<any>(threejsRaycast["threejsGenerator"], "changeObjectColor");

        threejsRaycast.updateSceneWithNewObject(objectUpdate);

        expect(spy).not.toHaveBeenCalled();
    });

});
