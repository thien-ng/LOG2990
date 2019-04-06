import * as THREE from "three";
import { IPosition2D } from "../../../../../../../common/communication/iGameplay";

export class ThreejsMovement {

    private readonly CAMERA_MOVEMENT_SPEED:   number = 2;
    private readonly CAMERA_ROTATION_SPEED:   number = 0.01;
    private readonly CAMERA_COLLISION_RADIUS: number = 30;

    private velocity:   THREE.Vector3;
    private direction:  THREE.Vector3;

    public constructor(private camera: THREE.PerspectiveCamera, private scene: THREE.Scene) {
        this.velocity   = new THREE.Vector3(0, 0, 0);
        this.direction  = new THREE.Vector3(0, 0, 0);
    }

    public rotateCamera(position: IPosition2D): void {
        const yAxis: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
        const xAxis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
        this.camera.rotateOnAxis(xAxis, -position.y * this.CAMERA_ROTATION_SPEED);
        this.camera.rotateOnWorldAxis(yAxis, -position.x * this.CAMERA_ROTATION_SPEED);
    }

    public movementCamera(moveForward: boolean, moveBackward: boolean, moveLeft: boolean, moveRight: boolean): void {

        if ( moveForward || moveBackward || moveLeft || moveRight) {
            this.direction.z = Number(moveForward) - Number(moveBackward);
            this.direction.x = Number(moveRight)   - Number(moveLeft);
            this.setCameraVelocity();

            if (!this.objectIsBlockingDirection()) {
                this.translateCamera();
            }
        } else {
            this.multiplyVector(this.velocity, 0);
        }
    }

    private setCameraVelocity(): void {
        const direction: THREE.Vector3 = this.direction.clone().normalize();
        this.velocity.x = direction.x * this.CAMERA_MOVEMENT_SPEED;
        this.velocity.y = direction.y * this.CAMERA_MOVEMENT_SPEED;
        this.velocity.z = direction.z * this.CAMERA_MOVEMENT_SPEED;
    }

    private objectIsBlockingDirection(): boolean {

        const rayDirection: THREE.Vector3 = this.getDirection();
        const raycaster:    THREE.Raycaster =
        new THREE.Raycaster(this.camera.position, rayDirection);

        const objectsIntersected: THREE.Intersection[] = raycaster.intersectObjects(this.scene.children, true);

        return objectsIntersected.length > 0 && objectsIntersected[0].distance < this.CAMERA_COLLISION_RADIUS;
    }

    private getDirection(): THREE.Vector3 {
        const direction: THREE.Vector3 = this.addVectors(this.getForwardDirection(), this.getSideDirection());

        return direction.normalize();
    }

    private getForwardDirection(): THREE.Vector3 {
        let forwardVector: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        this.camera.getWorldDirection(forwardVector);
        forwardVector = this.multiplyVector(forwardVector, this.direction.z);

        return forwardVector.normalize();
    }

    private getSideDirection(): THREE.Vector3 {
        const yAxis:        THREE.Vector3 = new THREE.Vector3(0, 1, 0);
        const forwardVector:  THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        this.camera.getWorldDirection(forwardVector);
        let sideDirection:  THREE.Vector3 = this.crossProduct(forwardVector, yAxis);

        sideDirection = this.multiplyVector(sideDirection, this.direction.x);

        return sideDirection.normalize();
    }

    private translateCamera(): void {
        this.camera.translateX(this.velocity.x);
        this.camera.translateY(this.velocity.y);
        this.camera.translateZ(-this.velocity.z);
    }

    private multiplyVector (vector: THREE.Vector3, multiplier: number): THREE.Vector3 {
        return new THREE.Vector3(
            vector.x * multiplier,
            vector.y * multiplier,
            vector.z * multiplier,
        );
    }

    private addVectors (vector1: THREE.Vector3, vector2: THREE.Vector3): THREE.Vector3 {
        const toVector: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        toVector.x = vector1.x + vector2.x;
        toVector.y = vector1.y + vector2.y;
        toVector.z = vector1.z + vector2.z;

        return toVector;
    }

    private crossProduct (vector1: THREE.Vector3, vector2: THREE.Vector3): THREE.Vector3 {
        const toVector: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        toVector.x = (vector1.y * vector2.z) - (vector1.z * vector2.y);
        toVector.y = (vector1.x * vector2.z) - (vector1.z * vector2.x);
        toVector.z = (vector1.x * vector2.y) - (vector1.y * vector2.x);

        return toVector;
    }
}
