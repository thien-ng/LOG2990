import * as THREE from "three";
import { IBounderies, IPosition2D } from "../../../../../../../common/communication/iGameplay";
import { IVector3D } from "../../../../../../../common/communication/iSceneVariables";

export class ThreejsMovement {

    private readonly CAMERA_MOVEMENT_SPEED:   number = 2;
    private readonly CAMERA_ROTATION_SPEED:   number = 0.01;
    private readonly CAMERA_COLLISION_RADIUS: number = 5;

    private camera:     THREE.PerspectiveCamera;
    private velocity:   THREE.Vector3;
    private direction:  THREE.Vector3;
    private front:      THREE.Vector3;
    private orthogonal: THREE.Vector3;

    public constructor(camera: THREE.PerspectiveCamera, private scene: THREE.Scene) {
        this.camera     = camera;
        this.velocity   = new THREE.Vector3(0, 0, 0);
        this.direction  = new THREE.Vector3(0, 0, 0);
        this.front      = new THREE.Vector3(0, 0, 0);
        this.orthogonal = new THREE.Vector3(0, 0, 0);
    }

    public setupFront(orientation: number): void {
        this.camera.getWorldDirection(this.front);
        this.front.normalize();
        this.multiplyVector(this.front, orientation);
    }

    public rotateCamera(position: IPosition2D): void {
        const yAxis: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
        const xAxis: THREE.Vector3 = new THREE.Vector3(1, 0, 0);
        this.camera.rotateOnWorldAxis(yAxis, -position.x * this.CAMERA_ROTATION_SPEED);
        this.camera.rotateOnAxis(xAxis, -position.y * this.CAMERA_ROTATION_SPEED);
    }

    public movementCamera(moveForward: boolean, moveBackward: boolean, moveLeft: boolean, moveRight: boolean): void {

        if ( moveLeft ) {
          this.moveToSide(1);

        } else if ( moveRight ) {
          this.moveToSide(-1);
        }

        this.addVectors(this.front, this.orthogonal, this.direction);
        this.direction.normalize();

        if ( moveForward || moveBackward || moveLeft || moveRight) {

            this.direction.z = Number(moveBackward) - Number(moveForward);
            this.direction.x = Number(moveRight)    - Number(moveLeft);
            this.setCameratVelocity();
        } else {
            this.multiplyVector(this.velocity, 0);
        }
        if (!this.objectIsBlockingDirection(this.direction.z)) {
            this.translateCamera();
        }
    }

    private moveToSide(orientation: number): void {
        const frontvector:  THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        const yAxis:        THREE.Vector3 = new THREE.Vector3(0, orientation, 0);
        this.camera.getWorldDirection(frontvector);
        this.crossProduct(frontvector, yAxis, this.orthogonal);
    }

    private setCameratVelocity(): void {
        this.direction.normalize();
        this.velocity.x = this.direction.x * this.CAMERA_MOVEMENT_SPEED;
        this.velocity.y = this.direction.y * this.CAMERA_MOVEMENT_SPEED;
        this.velocity.z = this.direction.z * this.CAMERA_MOVEMENT_SPEED;
    }

    private objectIsBlockingDirection(frontDirection: number): boolean {
        const raycaster:      THREE.Raycaster = new THREE.Raycaster();
        const worldDirection: THREE.Vector3   = new THREE.Vector3();

        this.camera.getWorldDirection(worldDirection);

        const ray: THREE.Vector3 =
            new THREE.Vector3(worldDirection.x, worldDirection.y, worldDirection.z * - frontDirection);
        raycaster.set(this.camera.position, ray);

        const objectsIntersected: THREE.Intersection[] = raycaster.intersectObjects(this.scene.children, true);

        return objectsIntersected.length > 0 && objectsIntersected[0].distance < this.CAMERA_COLLISION_RADIUS;
    }

    // tslint:disable-next-line:max-func-body-length
    private translateCamera(): void {
        const minPos: IVector3D = {
            x : -100,
            y : -100,
            z : -100,
        };
        const maxPos: IVector3D = {
            x : 250,
            y : 250,
            z : 250,
        };
        const boundaries: IBounderies = {
            minPosition : minPos,
            maxPosition : maxPos,
        };

        const cameraPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        this.camera.getWorldPosition(cameraPosition);

        if (cameraPosition.x > boundaries.minPosition.x && cameraPosition.x < boundaries.maxPosition.x) {
            this.camera.translateX(this.velocity.x);
        } else if (cameraPosition.x < boundaries.minPosition.x) {
            this.camera.translateX(-1);
        } else if (cameraPosition.x > boundaries.maxPosition.x) {
            this.camera.translateX(1);
        }
        if (cameraPosition.y > boundaries.minPosition.y && cameraPosition.y < boundaries.maxPosition.y) {
            this.camera.translateY(this.velocity.y);
        } else if (cameraPosition.y < boundaries.minPosition.y) {
            this.camera.translateY(1);
        } else if (cameraPosition.y > boundaries.maxPosition.y) {
            this.camera.translateY(-1);
        }
        if (cameraPosition.z > boundaries.minPosition.z && cameraPosition.z < boundaries.maxPosition.z) {
            this.camera.translateZ(this.velocity.z);
        } else if (cameraPosition.z < boundaries.minPosition.z) {
            this.camera.translateZ(-1);
        } else if (cameraPosition.z > boundaries.maxPosition.z) {
            this.camera.translateZ(1);
        }
    }

    private multiplyVector (vector: THREE.Vector3, multiplier: number): void {
        vector.x *= multiplier;
        vector.y *= multiplier;
        vector.z *= multiplier;
    }

    private addVectors (vector1: THREE.Vector3, vector2: THREE.Vector3, toVector: THREE.Vector3): void {
        toVector = new THREE.Vector3(0, 0, 0);
        toVector.x = vector1.x + vector2.x;
        toVector.y = vector1.y + vector2.y;
        toVector.z = vector1.z + vector2.z;
    }

    private crossProduct (vector1: THREE.Vector3, vector2: THREE.Vector3, toVector: THREE.Vector3): void {
        toVector = new THREE.Vector3(0, 0, 0);
        toVector.x = (vector1.y * vector2.z) - (vector1.z * vector2.y);
        toVector.y = (vector1.x * vector2.z) - (vector1.z * vector2.x);
        toVector.z = (vector1.x * vector2.y) - (vector1.y * vector2.x);
    }

}
