import { inject, TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { anyNumber, mock, when } from "ts-mockito";
import { ActionType, IPosition2D, ISceneObjectUpdate } from "../../../../../../common/communication/iGameplay";
import { ISceneObject, SceneObjectType } from "../../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { GameViewFreeService } from "../game-view-free.service";
import { ThreejsViewService } from "./threejs-view.service";
import { ThreejsGenerator } from "./utilitaries/threejs-generator";
import { ThreejsRaycast } from "./utilitaries/threejs-raycast";

// tslint:disable:no-any max-file-line-count

const sceneVariables: ISceneVariables<ISceneObject> = {
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

  it("should generate objects in scene when create scenes is called", inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {
    const spy: any = spyOn<any>(threejsViewService, "generateSceneObjects");
    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
    expect(spy).toHaveBeenCalled();
  }));

  it("should add lighting in scene when createLigthing is called", inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {
    const spy: any = spyOn<any>(threejsViewService, "createLighting");
    threejsViewService.createScene(scene, sceneVariables, renderer, false, 1);
    expect(spy).toHaveBeenCalled();
  }));

  it("should render scene when animate is called", inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {
    const spy: any = spyOn<any>(threejsViewService, "renderScene");
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

  it("should not change any color if forced to put color back to original",
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

  it("should not do any update to scene because of undefined object (check if not call initiateObject)",
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

  it("should not do any update to scene because of undefined object (check if not call deleteObject)",
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

  it("should not do any update to scene because of undefined object (check if not call changeObjectColor)",
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

  it("should not do any update to scene because of no action required (check if not call initiateObject)",
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

  it("should not do any update to scene because of no action required (check if not call deleteObject)",
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

  it("should not do any update to scene because of no action required (check if not call changeObjectColor)",
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

  it("should call function initiate object from threejsGenerator (check if not call deleteObject)",
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

  it("should call function initiate object from threejsGenerator (check if not call changeObjectColor)",
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

  it("should call function delete object from threejsGenerator (check if not call initiateObject)",
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

  it("should call function delete object from threejsGenerator (check if not call changeObjectColor)",
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

  it("should call function change color object from threejsGenerator (check if not call initiateObject)",
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

  it("should call function change color object from threejsGenerator (check if not call deleteObject)",
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

  it("should make the camera move forward keyUp when key W is released",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

      const keyboardEvent: any = new KeyboardEvent("keyup", {
        key: "w",
      });

      threejsViewService.onKeyMovement(keyboardEvent, false);

      expect(threejsViewService["moveForward"]).toBe(false);
  }));

  it("should stop the camera move forward keyDown when key W is pressed",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    const keyboardEvent: any = new KeyboardEvent("keydown", {
      key: "w",
    });

    threejsViewService.onKeyMovement(keyboardEvent, true);

    expect(threejsViewService["moveForward"]).toBe(true);
  }));

  it("should make the camera move backward keyUp when key S is released",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

      const keyboardEvent: any = new KeyboardEvent("keyup", {
        key: "s",
      });

      threejsViewService.onKeyMovement(keyboardEvent, false);

      expect(threejsViewService["moveBackward"]).toBe(false);
  }));

  it("should stop the camera move backward keyDown when key S is pressed",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    const keyboardEvent: any = new KeyboardEvent("keydown", {
      key: "s",
    });

    threejsViewService.onKeyMovement(keyboardEvent, true);

    expect(threejsViewService["moveBackward"]).toBe(true);
  }));

  it("should stop the camera move to the left when key A is pressed",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    const keyboardEvent: any = new KeyboardEvent("keydown", {
      key: "a",
    });

    threejsViewService.onKeyMovement(keyboardEvent, true);

    expect(threejsViewService["moveLeft"]).toBe(true);
  }));

  it("should stop the camera move to the right when key D is pressed",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

    const keyboardEvent: any = new KeyboardEvent("keydown", {
      key: "d",
    });

    threejsViewService.onKeyMovement(keyboardEvent, true);

    expect(threejsViewService["moveRight"]).toBe(true);
  }));

  it("should not make camera move when unhandled key is pressed",
     inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {

      const keyboardEvent: any = new KeyboardEvent("keydown", {
        key: "p",
      });

      threejsViewService.onKeyMovement(keyboardEvent, true);

      expect(threejsViewService["moveRight"]).not.toBe(true);
  }));

});
