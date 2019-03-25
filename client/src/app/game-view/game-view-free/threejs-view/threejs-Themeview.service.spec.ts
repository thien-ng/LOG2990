import { inject, TestBed } from "@angular/core/testing";
import * as THREE from "three";
import {  anyNumber, mock, when } from "ts-mockito";
import { ActionType, IPosition2D, ISceneObjectUpdate } from "../../../../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { GameViewFreeService } from "../game-view-free.service";
import { ThreejsThemeViewService } from "./threejs-ThemeView.service";
import { ThreejsRaycast } from "./utilitaries/threejs-raycast";
import { ThreejsThemeGenerator } from "./utilitaries/threejs-themeGenerator";

// tslint:disable:no-any max-file-line-count max-line-length

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
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(() => {return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(() => {Promise.resolve(); });
    await threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService["threejsThemeRaycast"].setThreeGenerator(generator);
    const spy: any = spyOn(threejsThemeViewService["threejsGenerator"], "initiateObject").and.callFake(() => {return; });
    spyOn(threejsThemeViewService["gameViewFreeService"], "updateSceneLoaded").and.callFake(() => {return; });
    threejsThemeViewService["generateSceneObjects"](false, 1);
    expect(spy).toHaveBeenCalled();
  }));

  it("should set up front the threejsMovement", inject([ThreejsThemeViewService], async (threejsThemeViewService: ThreejsThemeViewService)=> {
    const spy: any = spyOn(threejsThemeViewService["threejsMovement"], "setupFront").and.callFake(() => {return; });
    threejsThemeViewService["setupFront"](1);
    expect(spy).toHaveBeenCalled();
  }));

  it("should add lighting in scene when createLigthing is called", inject([ThreejsThemeViewService], async (threejsThemeViewService: ThreejsThemeViewService) => {
    const spy: any = spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(() => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(() => {Promise.resolve(); });
    await threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    expect(spy).toHaveBeenCalled();
  }));

  it("should render scene when animate() is called", inject([ThreejsThemeViewService], async (threejsThemeViewService: ThreejsThemeViewService) => {
    const spy: any = spyOn<any>(threejsThemeViewService, "renderObject");
    spyOn<any>(threejsThemeViewService, "createLighting").and.callFake(() => {return; });
    spyOn<any>(threejsThemeViewService, "generateSceneObjects").and.callFake(() => { return; });
    spyOn<any>(threejsThemeViewService, "getModelObjects").and.callFake(() => {Promise.resolve(); });
    await threejsThemeViewService.createScene(scene, sceneVariables, renderer, false, 1);
    threejsThemeViewService.animate();
    expect(spy).toHaveBeenCalled();
  }));

