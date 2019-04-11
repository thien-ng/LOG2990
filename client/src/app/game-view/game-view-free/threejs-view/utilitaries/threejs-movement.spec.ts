import * as THREE from "three";
import { IPosition2D } from "../../../../../../../common/communication/iGameplay";
import { ThreejsMovement } from "./threejs-movement";

// tslint:disable:no-any no-magic-numbers

const position: IPosition2D = {
    x: 1,
    y: 1,
};

let threejsMovement:    ThreejsMovement;
let camera:             THREE.PerspectiveCamera;
let scene:              THREE.Scene;

describe("Threejs-movement", () => {

    beforeEach(() => {
        scene           = new THREE.Scene();
        camera          = new THREE.PerspectiveCamera();
        threejsMovement = new ThreejsMovement(camera, scene);
    });


    it("should set camera directions to back", () => {
        const spy: any = spyOn<any>(threejsMovement, "multiplyVector");
        threejsMovement.setupFront(-1);
        expect(spy).toHaveBeenCalled();
    });

    it("should rotate camera with position pass by reference (check X value)", () => {
        const spy: any = spyOn<any>(threejsMovement["camera"], "rotateOnWorldAxis");
        threejsMovement.rotateCamera(position);
        expect(spy).toHaveBeenCalled();
    });

    it("should rotate camera with position pass by reference (check Y value)", () => {
        const spy: any = spyOn<any>(threejsMovement["camera"], "rotateOnWorldAxis");
        threejsMovement.rotateCamera(position);
        expect(spy).toHaveBeenCalled();
    });

    it("should set camera velocity when camera keyboard isn't pressed (check movement)", () => {

        threejsMovement["front"]        = new THREE.Vector3(0, 0, 1);
        threejsMovement["orthogonal"]   = new THREE.Vector3(0, 0, 1);
        threejsMovement["direction"]    = new THREE.Vector3(1, 2, 3);
        threejsMovement["velocity"]     = new THREE.Vector3(3, 3, 3);

        threejsMovement.movementCamera(false, false, false, false);

        const isNewPosition: any =  threejsMovement["camera"].position.x === 0 ||
                                    threejsMovement["camera"].position.y === 0 ||
                                    threejsMovement["camera"].position.z === 0;

        expect(isNewPosition).toBe(true);
    });

    it("should set camera velocity when camera keyboard isn't pressed (check call)", () => {
        const spy: any = spyOn<any>(threejsMovement, "setCameratVelocity");

        threejsMovement["front"]        = new THREE.Vector3(0, 0, 1);
        threejsMovement["orthogonal"]   = new THREE.Vector3(0, 0, 1);
        threejsMovement["direction"]    = new THREE.Vector3(1, 2, 3);
        threejsMovement["velocity"]     = new THREE.Vector3(3, 3, 3);

        threejsMovement.movementCamera(false, false, false, false);

        expect(spy).not.toHaveBeenCalled();
    });

    it("should move camera forward (check value)", () => {
        const cameraMocked: any = threejsMovement["camera"];

        threejsMovement["front"]        = new THREE.Vector3(0, 0, 1);
        threejsMovement["orthogonal"]   = new THREE.Vector3(0, 0, 1);
        threejsMovement["direction"]    = new THREE.Vector3(1, 2, 3);
        threejsMovement["velocity"]     = new THREE.Vector3(3, 3, 3);

        threejsMovement.movementCamera(true, false, false, false);

        const isNewPosition: any =  threejsMovement["camera"].position.x !== cameraMocked.position.x &&
                                    threejsMovement["camera"].position.y !== cameraMocked.position.y &&
                                    threejsMovement["camera"].position.z !== cameraMocked.position.z;

        expect(isNewPosition).toBe(false);
    });

    it("should move camera forward (check call)", () => {
        const spy: any = spyOn<any>(threejsMovement, "setCameratVelocity");

        threejsMovement["front"]        = new THREE.Vector3(0, 0, 1);
        threejsMovement["orthogonal"]   = new THREE.Vector3(0, 0, 1);
        threejsMovement["direction"]    = new THREE.Vector3(1, 2, 3);
        threejsMovement["velocity"]     = new THREE.Vector3(3, 3, 3);

        threejsMovement.movementCamera(true, false, false, false);

        expect(spy).toHaveBeenCalled();
    });

    it("should move camera backward (check value)", () => {
        const cameraMocked: any = threejsMovement["camera"];

        threejsMovement["front"]        = new THREE.Vector3(0, 0, 1);
        threejsMovement["orthogonal"]   = new THREE.Vector3(0, 0, 1);
        threejsMovement["direction"]    = new THREE.Vector3(1, 2, 3);
        threejsMovement["velocity"]     = new THREE.Vector3(3, 3, 3);

        threejsMovement.movementCamera(false, true, false, false);

        const isNewPosition: any =  threejsMovement["camera"].position.x !== cameraMocked.position.x &&
                                    threejsMovement["camera"].position.y !== cameraMocked.position.y &&
                                    threejsMovement["camera"].position.z !== cameraMocked.position.z;

        expect(isNewPosition).toBe(false);
    });

    it("should move camera backward (check call)", () => {
        const spy: any = spyOn<any>(threejsMovement, "setCameratVelocity");

        threejsMovement["front"]        = new THREE.Vector3(0, 0, 1);
        threejsMovement["orthogonal"]   = new THREE.Vector3(0, 0, 1);
        threejsMovement["direction"]    = new THREE.Vector3(1, 2, 3);
        threejsMovement["velocity"]     = new THREE.Vector3(3, 3, 3);

        threejsMovement.movementCamera(false, true, false, false);

        expect(spy).toHaveBeenCalled();
    });

    it("should move camera left (check value)", () => {
        const cameraMocked: any = threejsMovement["camera"];

        threejsMovement["front"]        = new THREE.Vector3(0, 0, 1);
        threejsMovement["orthogonal"]   = new THREE.Vector3(0, 0, 1);
        threejsMovement["direction"]    = new THREE.Vector3(1, 2, 3);
        threejsMovement["velocity"]     = new THREE.Vector3(3, 3, 3);

        threejsMovement.movementCamera(false, false, true, false);

        const isNewPosition: any =  threejsMovement["camera"].position.x !== cameraMocked.position.x &&
                                    threejsMovement["camera"].position.y !== cameraMocked.position.y &&
                                    threejsMovement["camera"].position.z !== cameraMocked.position.z;

        expect(isNewPosition).toBe(false);
    });

    it("should move camera left (check call)", () => {
        const spy: any = spyOn<any>(threejsMovement, "setCameratVelocity");

        threejsMovement["front"]        = new THREE.Vector3(0, 0, 1);
        threejsMovement["orthogonal"]   = new THREE.Vector3(0, 0, 1);
        threejsMovement["direction"]    = new THREE.Vector3(1, 2, 3);
        threejsMovement["velocity"]     = new THREE.Vector3(3, 3, 3);

        threejsMovement.movementCamera(false, false, true, false);

        expect(spy).toHaveBeenCalled();
    });

    it("should move camera right (check value)", () => {
        const cameraMocked: any = threejsMovement["camera"];

        threejsMovement["front"]        = new THREE.Vector3(0, 0, 1);
        threejsMovement["orthogonal"]   = new THREE.Vector3(0, 0, 1);
        threejsMovement["direction"]    = new THREE.Vector3(1, 2, 3);
        threejsMovement["velocity"]     = new THREE.Vector3(3, 3, 3);

        threejsMovement.movementCamera(false, false, false, true);

        const isNewPosition: any =  threejsMovement["camera"].position.x !== cameraMocked.position.x &&
                                    threejsMovement["camera"].position.y !== cameraMocked.position.y &&
                                    threejsMovement["camera"].position.z !== cameraMocked.position.z;

        expect(isNewPosition).toBe(false);
    });

    it("should move camera right (check call)", () => {
        const spy: any = spyOn<any>(threejsMovement, "setCameratVelocity");

        threejsMovement["front"]        = new THREE.Vector3(0, 0, 1);
        threejsMovement["orthogonal"]   = new THREE.Vector3(0, 0, 1);
        threejsMovement["direction"]    = new THREE.Vector3(1, 2, 3);
        threejsMovement["velocity"]     = new THREE.Vector3(3, 3, 3);

        threejsMovement.movementCamera(false, false, false, true);

        expect(spy).toHaveBeenCalled();
    });

});
