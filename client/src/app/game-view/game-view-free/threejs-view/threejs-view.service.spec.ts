import { inject, TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { anyNumber, mock, when } from "ts-mockito";
import { ActionType, ISceneObjectUpdate, IPosition2D } from "../../../../../../common/communication/iGameplay";
import { SceneObjectType } from "../../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { ThreejsViewService } from "./threejs-view.service";
import { ThreejsGenerator } from "./utilitaries/threejs-generator";
import { GameViewFreeService } from "../game-view-free.service";
import { ThreejsRaycast } from "./utilitaries/threejs-raycast";

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

fdescribe("ThreejsViewService Tests", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ThreejsViewService],
  }));

  it("should generate object in scene", inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {
    const spy: any = spyOn<any>(threejsViewService, "generateSceneObjects");
    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
    expect(spy).toHaveBeenCalled();
  }));

  it("should add lighting in scene",    inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {
    const spy: any = spyOn<any>(threejsViewService, "createLighting");
    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
    expect(spy).toHaveBeenCalled();
  }));

  it("should render scene",             inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {
    const spy: any = spyOn<any>(threejsViewService, "renderObject");
    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
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
    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsViewService.changeObjectsColor(true, false, modifiedList);

    expect(spy).toHaveBeenCalled();
  }));

  it("should not change any color",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {
    const spy: any = spyOn<any>(threejsViewService, "recoverObjectFromScene").and.callThrough();

    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
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
    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
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
    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsViewService.changeObjectsColor(false, true, modifiedList);

    expect(spy).toHaveBeenCalled();
  }));

  it("should not do any update to scene because of undefined object (not call initiateObject)",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    threejsViewService["threejsGenerator"] = mock(ThreejsGenerator);

    const initSpy:   any = spyOn<any>(threejsViewService["threejsGenerator"], "initiateObject");

    const objectUpdate: ISceneObjectUpdate = {
      actionToApply: ActionType.NO_ACTION_REQUIRED,
    };

    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
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

    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
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

    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
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

    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
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

    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
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

    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
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

    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
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

    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
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

    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
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

    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
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

    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
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

    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsViewService.updateSceneWithNewObject(objectUpdate);

    expect(deleteSpy).not.toHaveBeenCalled();
  }));

  it("should call setupFront from threejsMovement",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    const spy: any = spyOn<any>(threejsViewService["threejsMovement"], "setupFront");
    threejsViewService.setupFront(1);
    expect(spy).toHaveBeenCalled();
  }));

  it("should call rotateCamera from threejsMovement",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

      const position: IPosition2D = {x: 1, y: 1};

      const spy: any = spyOn<any>(threejsViewService["threejsMovement"], "rotateCamera");
      threejsViewService.rotateCamera(position);
      expect(spy).toHaveBeenCalled();
  }));

  it("should call detectObject from threejsRayCast",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

       threejsViewService["gameViewFreeService"] = mock(GameViewFreeService);
       threejsViewService["threejsRaycast"] = mock(ThreejsRaycast);
       const spy: any = spyOn<any>(threejsViewService["threejsRaycast"], "detectObject");
      const mockedMouseEvent: any = mock(MouseEvent);

      threejsViewService.detectObject(mockedMouseEvent);

      expect(spy).toHaveBeenCalled();
  }));

  it("should call detectObject from threejsRayCast",
  inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    threejsViewService["gameViewFreeService"] = mock(GameViewFreeService);
    threejsViewService["threejsRaycast"] = mock(ThreejsRaycast);
    const spy: any = spyOn<any>(threejsViewService["threejsRaycast"], "detectObject");
   const mockedMouseEvent: any = mock(MouseEvent);

   threejsViewService.detectObject(mockedMouseEvent);

   expect(spy).toHaveBeenCalled();
}));

});
