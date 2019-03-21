import * as THREE from "three";
import { mock } from "ts-mockito";
import { ThreejsRaycast } from "./threejs-raycast";

// tslint:disable:no-any no-magic-numbers

const idBySceneId: Map<number, number> = new Map<number, number>();
idBySceneId.set(1, 1);

let camera:     THREE.PerspectiveCamera;
let renderer:   THREE.WebGLRenderer;
let scene:      THREE.Scene;
let threejsRaycast: ThreejsRaycast;

describe("threejs-raycast tests", () => {

    beforeEach(() => {
        camera          = mock(THREE.PerspectiveCamera);
        renderer        = mock(THREE.WebGLRenderer);
        scene           = mock(THREE.Scene);
        threejsRaycast  = new ThreejsRaycast(camera, renderer, scene);
    });

    it("should set maps of idBySceneId", () => {
        threejsRaycast.setMaps(idBySceneId);
        expect(threejsRaycast["idBySceneId"]).toEqual(idBySceneId);
    });

});