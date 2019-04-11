import { inject, TestBed } from "@angular/core/testing";
import * as THREE from "three";
import {  anyNumber, mock, when } from "ts-mockito";
import { ActionType, IPosition2D, ISceneObjectUpdate } from "../../../../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../../../../common/communication/iSceneObject";
import { IMeshInfo, ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { GameViewFreeService } from "../game-view-free.service";
import { ThreejsThemeViewService } from "./threejs-ThemeView.service";
import { ThreejsMovement } from "./utilitaries/threejs-movement";
import { ThreejsRaycast } from "./utilitaries/threejs-raycast";
import { ThreejsThemeGenerator } from "./utilitaries/threejs-themeGenerator";

// tslint:disable:no-any max-file-line-count max-line-length no-floating-promises no-magic-numbers

const sceneVariables: ISceneVariables<IMesh> = {
  theme:                  1,
  gameName:               "gameName",
  sceneObjectsQuantity:   1,
  sceneObjects: [
    {
      name: "",
      id:         1,
      meshInfo:   {GLTFUrl: "", uuid: ""},
      position:   { x: 1, y: 1, z: 1 },
      rotation:   { x: 1, y: 1, z: 1 },
      radius:      1,
      scaleFactor: 1,
      hidden:     true,
    },
  ],
  sceneBackgroundColor: "#FFFFFF",
};
const renderer:   THREE.WebGLRenderer   = mock(THREE.WebGLRenderer);
const scene:      THREE.Scene           = mock(THREE.Scene);
const generator:  ThreejsThemeGenerator = mock(ThreejsThemeGenerator);

describe("ThreejsThemeViewService Tests", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ThreejsThemeViewService],
  }));

  it("should generate objects in scene when createScene() is called", inject([ThreejsThemeViewService], async (threejsThemeViewService: ThreejsThemeViewService) => {
    const spy: any = spyOn<any>(threejsThemeViewService, "generateSceneObjects");
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(() => {Promise.resolve(); });
    await threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    expect(spy).toHaveBeenCalled();
  }));

  it("should initiate objects in scene when createScene() is called", inject([ThreejsThemeViewService], async (threejsThemeViewService: ThreejsThemeViewService) => {
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()   => {return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()  => {Promise.resolve(); });
    await threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService["threejsThemeRaycast"].setThreeGenerator(generator);
    const spy: any = spyOn(threejsThemeViewService["threejsGenerator"], "initiateObject").and.callFake(() => {return; });
    spyOn(threejsThemeViewService["gameViewFreeService"], "updateSceneLoaded").and.callFake(()            => {return; });
    threejsThemeViewService["generateSceneObjects"](false, 1);
    expect(spy).toHaveBeenCalled();
  }));

    expect(spy).toHaveBeenCalled();
  }));

  it("should add lighting in scene when createLigthing is called", inject([ThreejsThemeViewService], async (threejsThemeViewService: ThreejsThemeViewService) => {
    const spy: any = spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()  => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(()             => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()                  => {Promise.resolve(); });
    await threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    expect(spy).toHaveBeenCalled();
  }));

  it("should render scene when animate() is called", inject([ThreejsThemeViewService], async (threejsThemeViewService: ThreejsThemeViewService) => {
    const spy: any = spyOn<any>(threejsThemeViewService, "renderObject");
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });
    await threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService.animate();
    expect(spy).toHaveBeenCalled();
  }));

  it("should change color of the mesh object to cheat color",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {
    const spy: any = spyOn<any>(threejsThemeViewService, "recoverObjectFromScene").and.callThrough();
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });

    const generatedColor:   THREE.MeshBasicMaterial = new THREE.MeshPhongMaterial( {color: "#FFFFFF"} );
    const sphereGeometry:   THREE.Geometry          = new THREE.SphereGeometry(1);
    const generatedObject:  THREE.Mesh              = new THREE.Mesh(sphereGeometry, generatedColor);

    when(scene.getObjectById(anyNumber())).thenReturn(generatedObject);

    const modifiedList: number[] = [1];
    threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService["threejsGenerator"] = generator;
    threejsThemeViewService.changeObjectsColor(true, false, modifiedList);

    expect(spy).toHaveBeenCalled();
  }));

  it("should not change any color if forced to put color back to original",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {
    const spy: any = spyOn<any>(threejsThemeViewService, "recoverObjectFromScene").and.callThrough();
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });

    threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService["threejsGenerator"] = generator;
    threejsThemeViewService.changeObjectsColor(true, false, undefined);

    expect(spy).not.toHaveBeenCalled();
  }));

  it("should change color of the mesh object to origin color",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {
    const spy: any = spyOn<any>(threejsThemeViewService, "recoverObjectFromScene").and.callThrough();
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });

    const generatedColor:   THREE.MeshBasicMaterial = new THREE.MeshPhongMaterial( {color: "#FFFFFF"} );
    const sphereGeometry:   THREE.Geometry          = new THREE.SphereGeometry(1);
    const generatedObject:  THREE.Mesh              = new THREE.Mesh(sphereGeometry, generatedColor);

    when(scene.getObjectById(anyNumber())).thenReturn(generatedObject);

    const modifiedList: number[] = [1];
    threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService["threejsGenerator"] = generator;
    threejsThemeViewService.changeObjectsColor(false, false, modifiedList);

    expect(spy).toHaveBeenCalled();
  }));

  it("should change color of the mesh object to original opacity",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {
    const spy: any = spyOn<any>(threejsThemeViewService, "recoverObjectFromScene").and.callThrough();
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });

    const generatedColor:   THREE.MeshBasicMaterial = new THREE.MeshPhongMaterial( {color: "#FFFFFF"} );
    const sphereGeometry:   THREE.Geometry          = new THREE.SphereGeometry(1);
    const generatedObject:  THREE.Mesh              = new THREE.Mesh(sphereGeometry, generatedColor);

    when(scene.getObjectById(anyNumber())).thenReturn(generatedObject);

    const modifiedList: number[] = [1];
    threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService["threejsGenerator"] = generator;
    threejsThemeViewService.changeObjectsColor(false, true, modifiedList);

    expect(spy).toHaveBeenCalled();
  }));

  it("should not do any update to scene because of undefined object (check if not call initiateObject)",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

    threejsThemeViewService["threejsGenerator"]     = mock(ThreejsThemeGenerator);
    threejsThemeViewService["threejsThemeRaycast"]  = mock(ThreejsRaycast);

    const initSpy:   any = spyOn<any>(threejsThemeViewService["threejsGenerator"], "initiateObject");

    const objectUpdate: ISceneObjectUpdate<ISceneObject | IMesh> = {
      actionToApply: ActionType.NO_ACTION_REQUIRED,
    };
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });

    threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService.updateSceneWithNewObject(objectUpdate);

    expect(initSpy).not.toHaveBeenCalled();
  }));

  it("should not do any update to scene because of undefined object (check if not call deleteObject)",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

    threejsThemeViewService["threejsGenerator"]     = mock(ThreejsThemeGenerator);
    threejsThemeViewService["threejsThemeRaycast"]  = mock(ThreejsRaycast);

    const deleteSpy: any = spyOn<any>(threejsThemeViewService["threejsGenerator"], "deleteObject");

    const objectUpdate: ISceneObjectUpdate<ISceneObject | IMesh> = {
      actionToApply: ActionType.NO_ACTION_REQUIRED,
    };
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });

    threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService.updateSceneWithNewObject(objectUpdate);

    expect(deleteSpy).not.toHaveBeenCalled();
  }));

  it("should not do any update to scene because of undefined object (check if not call changeObjectColor)",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

    threejsThemeViewService["threejsGenerator"]     = mock(ThreejsThemeGenerator);
    threejsThemeViewService["threejsThemeRaycast"]  = mock(ThreejsRaycast);

    const changeSpy: any = spyOn<any>(threejsThemeViewService["threejsGenerator"], "changeObjectColor");

    const objectUpdate: ISceneObjectUpdate<ISceneObject | IMesh> = {
      actionToApply: ActionType.NO_ACTION_REQUIRED,
    };
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });

    threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService.updateSceneWithNewObject(objectUpdate);

    expect(changeSpy).not.toHaveBeenCalled();
  }));

  it("should not do any update to scene because of no action required (check if not call initiateObject)",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

    threejsThemeViewService["threejsGenerator"] = mock(ThreejsThemeGenerator);
    threejsThemeViewService["threejsThemeRaycast"] = mock(ThreejsRaycast);
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });

    const initSpy:   any = spyOn<any>(threejsThemeViewService["threejsGenerator"], "initiateObject");

    const objectUpdate: ISceneObjectUpdate<ISceneObject | IMesh> = {
      actionToApply: ActionType.NO_ACTION_REQUIRED,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService.updateSceneWithNewObject(objectUpdate);

    expect(initSpy).not.toHaveBeenCalled();
  }));

  it("should not do any update to scene because of no action required (check if not call deleteObject)",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

    threejsThemeViewService["threejsGenerator"] = mock(ThreejsThemeGenerator);
    threejsThemeViewService["threejsThemeRaycast"] = mock(ThreejsRaycast);
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });

    const deleteSpy: any = spyOn<any>(threejsThemeViewService["threejsGenerator"], "deleteObject");

    const objectUpdate: ISceneObjectUpdate<ISceneObject | IMesh> = {
      actionToApply: ActionType.NO_ACTION_REQUIRED,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService.updateSceneWithNewObject(objectUpdate);

    expect(deleteSpy).not.toHaveBeenCalled();
  }));

  it("should not do any update to scene because of no action required (check if not call changeObjectColor)",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

    threejsThemeViewService["threejsGenerator"] = mock(ThreejsThemeGenerator);
    threejsThemeViewService["threejsThemeRaycast"] = mock(ThreejsRaycast);
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });

    const changeSpy: any = spyOn<any>(threejsThemeViewService["threejsGenerator"], "changeObjectColor");

    const objectUpdate: ISceneObjectUpdate<ISceneObject | IMesh> = {
      actionToApply: ActionType.NO_ACTION_REQUIRED,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService.updateSceneWithNewObject(objectUpdate);

    expect(changeSpy).not.toHaveBeenCalled();
  }));

  it("should call function initiate object from threejsGenerator (check if not call deleteObject)",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

    threejsThemeViewService["threejsGenerator"]     = mock(ThreejsThemeGenerator);
    threejsThemeViewService["threejsThemeRaycast"]  = mock(ThreejsRaycast);
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });

    const deleteSpy: any = spyOn<any>(threejsThemeViewService["threejsGenerator"], "deleteObject");

    const objectUpdate: ISceneObjectUpdate<ISceneObject | IMesh> = {
      actionToApply: ActionType.ADD,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService.updateSceneWithNewObject(objectUpdate);

    expect(deleteSpy).not.toHaveBeenCalled();
  }));

  it("should call function initiate object from threejsGenerator (check if not call changeObjectColor)",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

    threejsThemeViewService["threejsGenerator"] = mock(ThreejsThemeGenerator);
    threejsThemeViewService["threejsThemeRaycast"] = mock(ThreejsRaycast);
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });

    const changeSpy: any = spyOn<any>(threejsThemeViewService["threejsGenerator"], "changeObjectColor");

    const objectUpdate: ISceneObjectUpdate<ISceneObject | IMesh> = {
      actionToApply: ActionType.ADD,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService.updateSceneWithNewObject(objectUpdate);

    expect(changeSpy).not.toHaveBeenCalled();
  }));

  it("should call function delete object from threejsGenerator (check if not call initiateObject)",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

    threejsThemeViewService["threejsGenerator"]     = mock(ThreejsThemeGenerator);
    threejsThemeViewService["threejsThemeRaycast"]  = mock(ThreejsRaycast);
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });

    const initSpy:   any = spyOn<any>(threejsThemeViewService["threejsGenerator"], "initiateObject");

    const objectUpdate: ISceneObjectUpdate<ISceneObject | IMesh> = {
      actionToApply: ActionType.DELETE,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService.updateSceneWithNewObject(objectUpdate);

    expect(initSpy).not.toHaveBeenCalled();
  }));

  it("should call function delete object from threejsGenerator (check if not call changeObjectColor)",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

    threejsThemeViewService["threejsGenerator"] = mock(ThreejsThemeGenerator);
    threejsThemeViewService["threejsThemeRaycast"] = mock(ThreejsRaycast);
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });

    const changeSpy: any = spyOn<any>(threejsThemeViewService["threejsGenerator"], "changeObjectColor");

    const objectUpdate: ISceneObjectUpdate<ISceneObject | IMesh> = {
      actionToApply: ActionType.DELETE,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService.updateSceneWithNewObject(objectUpdate);

    expect(changeSpy).not.toHaveBeenCalled();
  }));

  it("should call function change color object from threejsGenerator (check if not call initiateObject)",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

    threejsThemeViewService["threejsGenerator"]     = mock(ThreejsThemeGenerator);
    threejsThemeViewService["threejsThemeRaycast"]  = mock(ThreejsRaycast);
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });

    const initSpy:   any = spyOn<any>(threejsThemeViewService["threejsGenerator"], "initiateObject");

    const objectUpdate: ISceneObjectUpdate<ISceneObject | IMesh> = {
      actionToApply: ActionType.CHANGE_COLOR,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService.updateSceneWithNewObject(objectUpdate);

    expect(initSpy).not.toHaveBeenCalled();
  }));

  it("should call function change color object from threejsGenerator (check if not call deleteObject)",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

    threejsThemeViewService["threejsGenerator"]     = mock(ThreejsThemeGenerator);
    threejsThemeViewService["threejsThemeRaycast"]  = mock(ThreejsRaycast);
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(()       => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(()      => {Promise.resolve(); });

    const deleteSpy: any = spyOn<any>(threejsThemeViewService["threejsGenerator"], "deleteObject");

    const objectUpdate: ISceneObjectUpdate<ISceneObject | IMesh> = {
      actionToApply: ActionType.CHANGE_COLOR,
      sceneObject:   sceneVariables.sceneObjects[0],
    };

    threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService.updateSceneWithNewObject(objectUpdate);

    expect(deleteSpy).not.toHaveBeenCalled();
  }));

  it("should call rotateCamera from threejsMovement",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

      threejsThemeViewService["threejsMovement"] = mock(ThreejsMovement);

      const position: IPosition2D = {x: 1, y: 1};

      const spy: any = spyOn<any>(threejsThemeViewService["threejsMovement"], "rotateCamera");
      threejsThemeViewService.rotateCamera(position);
      expect(spy).toHaveBeenCalled();
  }));

  it("should call detectObject from threejsRayCast",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

        threejsThemeViewService["gameViewFreeService"] = mock(GameViewFreeService);
        threejsThemeViewService["threejsThemeRaycast"] = mock(ThreejsRaycast);
        const spy: any = spyOn<any>(threejsThemeViewService["threejsThemeRaycast"], "detectObject");
        const mockedMouseEvent: any = mock(MouseEvent);

        threejsThemeViewService.detectObject(mockedMouseEvent);

        expect(spy).toHaveBeenCalled();
  }));

  it("should call detectObject from threejsRayCast",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

      threejsThemeViewService["gameViewFreeService"] = mock(GameViewFreeService);
      threejsThemeViewService["threejsThemeRaycast"] = mock(ThreejsRaycast);
      const spy: any = spyOn<any>(threejsThemeViewService["threejsThemeRaycast"], "detectObject");
      const mockedMouseEvent: any = mock(MouseEvent);

      threejsThemeViewService.detectObject(mockedMouseEvent);

      expect(spy).toHaveBeenCalled();
  }));

  it("should stop the camera move forward keyUp when key W is released",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

      const keyboardEvent: any = new KeyboardEvent("keyup", {
        key: "w",
      });

      threejsThemeViewService.onKeyMovement(keyboardEvent, false);

      expect(threejsThemeViewService["moveForward"]).toBe(false);
  }));

  it("should make the camera move forward keyDown when key W is pressed",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

    threejsThemeViewService["threejsMovement"] = mock(ThreejsMovement);

    const keyboardEvent: any = new KeyboardEvent("keydown", {
      key: "w",
    });

    threejsThemeViewService.onKeyMovement(keyboardEvent, true);

    expect(threejsThemeViewService["moveForward"]).toBe(true);
  }));

  it("should stop the camera move backward keyUp when key S is released",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

      const keyboardEvent: any = new KeyboardEvent("keyup", {
        key: "s",
      });

      threejsThemeViewService.onKeyMovement(keyboardEvent, false);

      expect(threejsThemeViewService["moveBackward"]).toBe(false);
  }));

  it("should move the camera move backward keyDown when key S is pressed",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

    threejsThemeViewService["threejsMovement"] = mock(ThreejsMovement);

    const keyboardEvent: any = new KeyboardEvent("keydown", {
      key: "s",
    });

    threejsThemeViewService.onKeyMovement(keyboardEvent, true);

    expect(threejsThemeViewService["moveBackward"]).toBe(true);
  }));

  it("should move the camera move to the left when key A is pressed",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

    const keyboardEvent: any = new KeyboardEvent("keydown", {
      key: "a",
    });

    threejsThemeViewService.onKeyMovement(keyboardEvent, true);

    expect(threejsThemeViewService["moveLeft"]).toBe(true);
  }));

  it("should stop the camera move to the right when key D is pressed",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

    const keyboardEvent: any = new KeyboardEvent("keydown", {
      key: "d",
    });

    threejsThemeViewService.onKeyMovement(keyboardEvent, true);

    expect(threejsThemeViewService["moveRight"]).toBe(true);
  }));

  it("should not make camera move when unhandled key is pressed",
     inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {

      const keyboardEvent: any = new KeyboardEvent("keydown", {
        key: "p",
      });

      threejsThemeViewService.onKeyMovement(keyboardEvent, true);

      expect(threejsThemeViewService["moveRight"]).not.toBe(true);
  }));

  it("should set attribute 'meshInfos' with parameter passed to createScene()", inject([ThreejsThemeViewService], async (threejsThemeViewService: ThreejsThemeViewService) => {
    const meshInfoMock: IMeshInfo[] = [{
      GLTFUrl: "",
      uuid: "",
    }];

    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(() => {Promise.resolve(); });
    await threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1, meshInfoMock);
    expect(threejsThemeViewService["meshInfos"]).toBeDefined();
  }));

  it("should call setObjectOpacity() if meshObject is not undefined", inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {
    const modifiedListMock: number[] = [1, 2];
    const threejsThemeGeneratorMock: ThreejsThemeGenerator = mock(ThreejsThemeGenerator);
    threejsThemeViewService["threejsGenerator"] = threejsThemeGeneratorMock;

    const spy: any = spyOn<any>(threejsThemeViewService["threejsGenerator"], "setObjectOpacity");
    spyOn<any>(threejsThemeViewService, "recoverObjectFromScene").and.callFake( () => 1);
    threejsThemeViewService.changeObjectsColor(true, false, modifiedListMock);

    expect(spy).toHaveBeenCalled();
  }));

  it("should not call setObjectOpacity() if meshObject is undefined", inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {
    const modifiedListMock: number[] = [1, 2];
    const threejsThemeGeneratorMock: ThreejsThemeGenerator = mock(ThreejsThemeGenerator);
    threejsThemeViewService["threejsGenerator"] = threejsThemeGeneratorMock;

    const spy: any = spyOn<any>(threejsThemeViewService["threejsGenerator"], "setObjectOpacity");
    spyOn<any>(threejsThemeViewService, "recoverObjectFromScene").and.callFake( () => undefined);
    threejsThemeViewService.changeObjectsColor(true, false, modifiedListMock);

    expect(spy).not.toHaveBeenCalled();
  }));

  it("should return 'undefined' if 'instanceObject3D' is undefined", inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {
    threejsThemeViewService["scene"] = mock(THREE.Scene);
    when(scene.getObjectById(anyNumber())).thenReturn(undefined);
    spyOn(threejsThemeViewService["scene"], "getObjectById").and.callFake( () => undefined);
    const result: THREE.Mesh | undefined = threejsThemeViewService["recoverObjectFromScene"](anyNumber());

    expect(result).toBeUndefined();
  }));

  it("should call getGLTFs() when calling getModelObjects()", inject([ThreejsThemeViewService], async (threejsThemeViewService: ThreejsThemeViewService) => {
    const meshInfoMock: IMeshInfo[] = [{
      GLTFUrl: "",
      uuid: "",
    }];
    const spy: any = spyOn<any>(threejsThemeViewService, "getGLTFs");

    await threejsThemeViewService["getModelObjects"](meshInfoMock);

    expect(spy).toHaveBeenCalled();
  }));

  it("should push new Promise to 'allPromises' when calling getGLTFs() (meshUrl is null)", inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {
    const meshInfoMock: IMeshInfo[] = [{
      GLTFUrl: "",
      uuid: "",
    }];
    const spy: any = spyOn<any>(threejsThemeViewService["allPromises"], "push");

    threejsThemeViewService["getGLTFs"](meshInfoMock);

    expect(spy).toHaveBeenCalled();
  }));

  it("should not call updateScenLoaded() if 'isSnapshotNeeded' is true", inject([ThreejsThemeViewService], (threejsThemeViewService: ThreejsThemeViewService) => {
    threejsThemeViewService["sceneVariables"] = sceneVariables;
    threejsThemeViewService["threejsGenerator"] = generator;
    const spy: any = spyOn<any>(threejsThemeViewService["gameViewFreeService"], "updateSceneLoaded");
    threejsThemeViewService["generateSceneObjects"](true, 1);

    expect(spy).not.toHaveBeenCalled();
  }));

});
