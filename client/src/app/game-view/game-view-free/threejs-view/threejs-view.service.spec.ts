import { inject, TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { mock, when, anyString } from "ts-mockito";
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

fdescribe("ThreejsViewService Tests", () => {
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

  it("should change color of the mesh object", inject([ThreejsViewService], (threejsViewService: ThreejsViewService) => {
    const generatedColor:   THREE.MeshBasicMaterial = new THREE.MeshPhongMaterial( {color: "#FFFFFF"} )
    const sphereGeometry:   THREE.Geometry          = new THREE.SphereGeometry(1);
    const generatedObject:  THREE.Mesh              = new THREE.Mesh(sphereGeometry, generatedColor);

    // const mapOriginColor: Map<number, string> = new Map();
    // const modifiedMap:    Map<number, number> = new Map();

    // mapOriginColor.set(1, "#FF0000");
    // modifiedMap.set(1, generatedColor.id);

    // threejsViewService["mapOriginColor"] = mapOriginColor;
    // threejsViewService["modifiedMap"] = modifiedMap;

    when(scene.getObjectById(anyString())).thenReturn(generatedObject);

    const modifiedList: number[] = [1];
    threejsViewService.createScene(scene, sceneVariables, renderer);
    threejsViewService.changeObjectsColor(modifiedList, true);


  }));

});
