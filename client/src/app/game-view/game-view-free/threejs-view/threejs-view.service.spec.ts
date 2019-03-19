import { inject, TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { anyNumber, mock, when } from "ts-mockito";
import { ActionType, ISceneObjectUpdate } from "../../../../../../common/communication/iGameplay";
import { SceneObjectType } from "../../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { ThreejsViewService } from "./threejs-view.service";
import { ThreejsGenerator } from "./utilitaries/threejs-generator";

// tslint:disable:no-any max-file-line-count

const sceneVariables: ISceneVariables = {
  theme:                  1,
  gameName:               "gameName",
  sceneObjectsQuantity:   1,
  sceneObjects: [
    {
      id:         1,
      type:       SceneObjectType.Cone,
      position:   { x: 1, y: 1, z: 1 },
      rotation:   { x: 1, y: 1, z: 1 },
      color:      "#FFFFFF",
      scale:      { x: 1, y: 1, z: 1 },
      hidden:     true,
    },
  ],
  sceneBackgroundColor: "#FFFFFF",
};
const renderer: THREE.WebGLRenderer = mock(THREE.WebGLRenderer);
const scene:    THREE.Scene         = mock(THREE.Scene);

describe("ThreejsViewService Tests", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ThreejsViewService],
  }));

  it("should generate object in scene", inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {
    const spy: any = spyOn<any>(threejsViewService, "generateSceneObjects");
    threejsViewService.createScene(scene, sceneVariables, renderer);
    expect(spy).toHaveBeenCalled();
  }));

  it("should add lighting in scene",    inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {
    const spy: any = spyOn<any>(threejsViewService, "createLighting");
    threejsViewService.createScene(scene, sceneVariables, renderer);
    expect(spy).toHaveBeenCalled();
  }));

  it("should render scene",             inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {
    const spy: any = spyOn<any>(threejsViewService, "renderObject");
    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.animate();
    expect(spy).toHaveBeenCalled();
  }));

  it("should change color of the mesh object to cheat color",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {
    const spy: any = spyOn<any>(threejsViewService, "recoverObjectFromScene").and.callThrough();

    const generatedColor:   THREE.MeshBasicMaterial = new THREE.MeshPhongMaterial( {color: "#FFFFFF"} );
    const sphereGeometry:   THREE.Geometry          = new THREE.SphereGeometry(1);
    const generatedObject:  THREE.Mesh              = new THREE.Mesh(sphereGeometry, generatedColor);

    when(scene.getObjectById(anyNumber())).thenReturn(generatedObject);

    const modifiedList: number[] = [1];
    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.changeObjectsColor(true, false, modifiedList);

    expect(spy).toHaveBeenCalled();
  }));

  it("",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {
    const spy: any = spyOn<any>(threejsViewService, "recoverObjectFromScene").and.callThrough();

    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.changeObjectsColor(true, false, undefined);

    expect(spy).not.toHaveBeenCalled();
  }));

  it("should change color of the mesh object to origin color",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {
    const spy: any = spyOn<any>(threejsViewService, "recoverObjectFromScene").and.callThrough();

    const generatedColor:   THREE.MeshBasicMaterial = new THREE.MeshPhongMaterial( {color: "#FFFFFF"} );
    const sphereGeometry:   THREE.Geometry          = new THREE.SphereGeometry(1);
    const generatedObject:  THREE.Mesh              = new THREE.Mesh(sphereGeometry, generatedColor);

    when(scene.getObjectById(anyNumber())).thenReturn(generatedObject);

    const modifiedList: number[] = [1];
    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.changeObjectsColor(false, false, modifiedList);

    expect(spy).toHaveBeenCalled();
  }));

  it("should change color of the mesh object to original opacity",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {
    const spy: any = spyOn<any>(threejsViewService, "recoverObjectFromScene").and.callThrough();

    const generatedColor:   THREE.MeshBasicMaterial = new THREE.MeshPhongMaterial( {color: "#FFFFFF"} );
    const sphereGeometry:   THREE.Geometry          = new THREE.SphereGeometry(1);
    const generatedObject:  THREE.Mesh              = new THREE.Mesh(sphereGeometry, generatedColor);

    when(scene.getObjectById(anyNumber())).thenReturn(generatedObject);

    const modifiedList: number[] = [1];
    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.changeObjectsColor(false, true, modifiedList);

    expect(spy).toHaveBeenCalled();
  }));

  it("should return -1 if no object is detected",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    threejsViewService["mouse"]     = mock(THREE.Vector3);
    threejsViewService["camera"]    = mock(THREE.PerspectiveCamera);
    threejsViewService["raycaster"] = mock(THREE.Raycaster);

    threejsViewService.createScene(scene, sceneVariables, renderer);
    const result: number = threejsViewService.detectObject(mock(MouseEvent));

    expect(result).toBe(-1);

  }));

  it("should not do any update to scene because of undefined object (not call initiateObject)",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    threejsViewService["threejsGenerator"] = mock(ThreejsGenerator);

    const initSpy:   any = spyOn<any>(threejsViewService["threejsGenerator"], "initiateObject");

    const objectUpdate: ISceneObjectUpdate = {
      actionToApply: ActionType.NO_ACTION_REQUIRED,
    };

    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.updateSceneWithNewObject(objectUpdate);

    expect(initSpy).not.toHaveBeenCalled();
  }));

  it("should not do any update to scene because of undefined object (not call deleteObject)",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    threejsViewService["threejsGenerator"] = mock(ThreejsGenerator);

    const deleteSpy: any = spyOn<any>(threejsViewService["threejsGenerator"], "deleteObject");

    const objectUpdate: ISceneObjectUpdate = {
      actionToApply: ActionType.NO_ACTION_REQUIRED,
    };

    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.updateSceneWithNewObject(objectUpdate);

    expect(deleteSpy).not.toHaveBeenCalled();
  }));

  it("should not do any update to scene because of undefined object (not call changeObjectColor)",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    threejsViewService["threejsGenerator"] = mock(ThreejsGenerator);

    const changeSpy: any = spyOn<any>(threejsViewService["threejsGenerator"], "changeObjectColor");

    const objectUpdate: ISceneObjectUpdate = {
      actionToApply: ActionType.NO_ACTION_REQUIRED,
    };

    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.updateSceneWithNewObject(objectUpdate);

    expect(changeSpy).not.toHaveBeenCalled();
  }));

  it("should not do any update to scene because of no action required (not call initiateObject)",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    threejsViewService["threejsGenerator"] = mock(ThreejsGenerator);

    const initSpy:   any = spyOn<any>(threejsViewService["threejsGenerator"], "initiateObject");

    const objectUpdate: ISceneObjectUpdate = {
      actionToApply: ActionType.NO_ACTION_REQUIRED,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.updateSceneWithNewObject(objectUpdate);

    expect(initSpy).not.toHaveBeenCalled();
  }));

  it("should not do any update to scene because of no action required (not call deleteObject)",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    threejsViewService["threejsGenerator"] = mock(ThreejsGenerator);

    const deleteSpy: any = spyOn<any>(threejsViewService["threejsGenerator"], "deleteObject");

    const objectUpdate: ISceneObjectUpdate = {
      actionToApply: ActionType.NO_ACTION_REQUIRED,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.updateSceneWithNewObject(objectUpdate);

    expect(deleteSpy).not.toHaveBeenCalled();
  }));

  it("should not do any update to scene because of no action required (not call changeObjectColor)",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    threejsViewService["threejsGenerator"] = mock(ThreejsGenerator);

    const changeSpy: any = spyOn<any>(threejsViewService["threejsGenerator"], "changeObjectColor");

    const objectUpdate: ISceneObjectUpdate = {
      actionToApply: ActionType.NO_ACTION_REQUIRED,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.updateSceneWithNewObject(objectUpdate);

    expect(changeSpy).not.toHaveBeenCalled();
  }));

  it("should call function initiate object from threejsGenerator (not call deleteObject)",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    threejsViewService["threejsGenerator"] = mock(ThreejsGenerator);

    const deleteSpy: any = spyOn<any>(threejsViewService["threejsGenerator"], "deleteObject");

    const objectUpdate: ISceneObjectUpdate = {
      actionToApply: ActionType.ADD,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.updateSceneWithNewObject(objectUpdate);

    expect(deleteSpy).not.toHaveBeenCalled();
  }));

  it("should call function initiate object from threejsGenerator (not call changeObjectColor)",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    threejsViewService["threejsGenerator"] = mock(ThreejsGenerator);

    const changeSpy: any = spyOn<any>(threejsViewService["threejsGenerator"], "changeObjectColor");

    const objectUpdate: ISceneObjectUpdate = {
      actionToApply: ActionType.ADD,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.updateSceneWithNewObject(objectUpdate);

    expect(changeSpy).not.toHaveBeenCalled();
  }));

  it("should call function delete object from threejsGenerator (not call initiateObject)",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    threejsViewService["threejsGenerator"] = mock(ThreejsGenerator);

    const initSpy:   any = spyOn<any>(threejsViewService["threejsGenerator"], "initiateObject");

    const objectUpdate: ISceneObjectUpdate = {
      actionToApply: ActionType.DELETE,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.updateSceneWithNewObject(objectUpdate);

    expect(initSpy).not.toHaveBeenCalled();
  }));

  it("should call function delete object from threejsGenerator (not call changeObjectColor)",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    threejsViewService["threejsGenerator"] = mock(ThreejsGenerator);

    const changeSpy: any = spyOn<any>(threejsViewService["threejsGenerator"], "changeObjectColor");

    const objectUpdate: ISceneObjectUpdate = {
      actionToApply: ActionType.DELETE,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.updateSceneWithNewObject(objectUpdate);

    expect(changeSpy).not.toHaveBeenCalled();
  }));

  it("should call function change color object from threejsGenerator (not call initiateObject)",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    threejsViewService["threejsGenerator"] = mock(ThreejsGenerator);

    const initSpy:   any = spyOn<any>(threejsViewService["threejsGenerator"], "initiateObject");

    const objectUpdate: ISceneObjectUpdate = {
      actionToApply: ActionType.CHANGE_COLOR,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.updateSceneWithNewObject(objectUpdate);

    expect(initSpy).not.toHaveBeenCalled();
  }));

  it("should call function change color object from threejsGenerator (not call deleteObject)",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    threejsViewService["threejsGenerator"] = mock(ThreejsGenerator);

    const deleteSpy: any = spyOn<any>(threejsViewService["threejsGenerator"], "deleteObject");

    const objectUpdate: ISceneObjectUpdate = {
      actionToApply: ActionType.CHANGE_COLOR,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.updateSceneWithNewObject(objectUpdate);

    expect(deleteSpy).not.toHaveBeenCalled();
  }));

});
