import { inject, TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { SceneObjectType } from "../../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { ThreejsViewService } from "./threejs-view.service";
import { mock } from "ts-mockito";

let sceneVariables: ISceneVariables = {
  theme: 1,
  gameName: "gameName",
  sceneObjectsQuantity: 1,
  sceneObjects: [
    {
      id: 1,
      type: SceneObjectType.Cone,
      position: {x: 1, y: 1, z: 1},
      rotation: {x: 1, y: 1, z: 1},
      color: "#FFFFFF",
      scale: {x: 1, y: 1, z: 1},
    },
  ],
  sceneBackgroundColor: "#FFFFFF",
}
let renderer: THREE.WebGLRenderer = mock(THREE.WebGLRenderer);
let scene: THREE.Scene = mock(THREE.Scene);

fdescribe("ThreejsViewService Tests", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ThreejsViewService],
  }));

  it("should create scene", inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {
    // spyOn<any>(threejsViewService, "generateSceneObjects");
    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.animate();
    // expect(threejsViewService).toBeTruthy();
  }));

});
