import { TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { ThreejsViewService } from "./threejs-view.service";

let threejsViewService: ThreejsViewService;
let scene: THREE.Scene;
let sceneVariables: ISceneVariables = {
  
}

fdescribe("ThreejsViewService Tests", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  beforeEach(() => {
    threejsViewService = new ThreejsViewService();
    scene = new THREE.Scene();
  });

  it("should be created", () => {

  });
});
