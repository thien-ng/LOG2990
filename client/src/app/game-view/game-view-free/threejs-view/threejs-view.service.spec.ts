import { inject, TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { anyNumber, mock, when } from "ts-mockito";
import { SceneObjectType } from "../../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { ThreejsViewService } from "./threejs-view.service";

// tslint:disable:no-any

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
    threejsViewService.changeObjectsColor(modifiedList, true);

    expect(spy).toHaveBeenCalled();
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
    threejsViewService.changeObjectsColor(modifiedList, false);

    expect(spy).toHaveBeenCalled();
  }));

});
