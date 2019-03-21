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

describe("Threejs-movement", () => {

    beforeEach(() => {
        camera          = new THREE.PerspectiveCamera();
        threejsMovement = new ThreejsMovement(camera);
    });

    it("should set camera directions to front", () => {
        const spy: any = spyOn<any>(threejsMovement, "multiplyVector");
        threejsMovement.setupFront(1);
        expect(spy).toHaveBeenCalled();
    });

    it("should set camera directions to back", () => {
        const spy: any = spyOn<any>(threejsMovement, "multiplyVector");
        threejsMovement.setupFront(-1);
        expect(spy).toHaveBeenCalled();
    });

    it("should rotate camera with position pass by reference (check X value)", () => {
        const spy: any = spyOn<any>(threejsMovement["camera"], "rotateX");
        threejsMovement.rotateCamera(position);
        expect(spy).toHaveBeenCalled();
    });

    it("should rotate camera with position pass by reference (check Y value)", () => {
        const spy: any = spyOn<any>(threejsMovement["camera"], "rotateY");
        threejsMovement.rotateCamera(position);
        expect(spy).toHaveBeenCalled();
    });

    it("should set canera velocity when camera keyboard isn't pressed", () => {
        const spy: any = spyOn<any>(threejsMovement, "multiplyVector");
        threejsMovement.movementCamera(false, false, false, false);
        expect(spy).toHaveBeenCalled();
    });

    it("should move camera forward", () => {
        const spy: any = spyOn<any>(threejsMovement, "setCameratVelocity");
        threejsMovement.movementCamera(true, false, false, false);
        expect(spy).toHaveBeenCalled();
    });

    it("should move camera backward", () => {
        const spy: any = spyOn<any>(threejsMovement, "setCameratVelocity");
        threejsMovement.movementCamera(false, true, false, false);
        expect(spy).toHaveBeenCalled();
    });

    it("should move camera left", () => {
        const spy: any = spyOn<any>(threejsMovement, "moveToSide");
        threejsMovement.movementCamera(false, false, true, false);
        expect(spy).toHaveBeenCalled();
    });

    it("should move camera right", () => {
        const spy: any = spyOn<any>(threejsMovement, "moveToSide");
        threejsMovement.movementCamera(false, false, false, true);
        expect(spy).toHaveBeenCalled();
    });

    it("should move to side with to the left side", () => {
        const spy: any = spyOn<any>(threejsMovement, "crossProduct");
        threejsMovement["moveToSide"](1);
        expect(spy).toHaveBeenCalled();
    });

    it("should move to side with to the right side", () => {
        const spy: any = spyOn<any>(threejsMovement, "crossProduct");
        threejsMovement["moveToSide"](-1);
        expect(spy).toHaveBeenCalled();
    });

    it("should do a cross product of vectors", () => {
        const vector1: THREE.Vector3 = new THREE.Vector3(1, 2, 3);
        const vector2: THREE.Vector3 = new THREE.Vector3(4, 7, 1);
        const vector3: THREE.Vector3 = new THREE.Vector3(0, 0, 0);

        threejsMovement["crossProduct"](vector1, vector2, vector3);

        expect(vector3.x).toBe(0);
    });

});
