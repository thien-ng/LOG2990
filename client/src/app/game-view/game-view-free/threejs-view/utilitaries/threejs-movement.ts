import * as THREE from "three";
import { IPosition2D } from "../../../../../../../common/communication/iGameplay";

export class ThreejsMovement {

    private readonly CAMERA_MOVEMENT_SPEED:   number = 2;
    private readonly CAMERA_ROTATION_SPEED:   number = 0.01;
    private readonly CAMERA_COLLISION_RADIUS: number = 30;

    private velocity:   THREE.Vector3;
    private direction:  THREE.Vector3;
    private boule:      THREE.Mesh;

    public constructor(private camera: THREE.PerspectiveCamera, private scene: THREE.Scene) {
        this.velocity   = new THREE.Vector3(0, 0, 0);
        this.direction  = new THREE.Vector3(0, 0, 0);

        const geometry: THREE.SphereGeometry = new THREE.SphereGeometry( 0.1 );
        const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        this.boule = new THREE.Mesh( geometry, material );
        scene.add( this.boule );
    }

    private bougeMaBoule(): void {
        // this.boule.position.add()
        this.boule.position.x = this.camera.position.x + this.getDirection().x * (10);
        this.boule.position.y = this.camera.position.y + this.getDirection().y * (10);
        this.boule.position.z = this.camera.position.z + this.getDirection().z * (10);
        const boulePos: THREE.Vector3 = this.boule.position.clone();
        boulePos.ceil();
        // console.log("Boule pos : ", boulePos.x, ", ", boulePos.y, ", ", boulePos.z);
        // tslint:disable-next-line:max-line-length
        // console.log("Camera pos : " + this.camera.position.x.toFixed(2) + ", " + this.camera.position.y.toFixed(2) + ", " + this.camera.position.z.toFixed(2));
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
            this.bougeMaBoule();
            this.setCameraVelocity();

            if (!this.objectIsBlockingDirection()) {
                this.translateCamera();
                // const f: THREE.Vector3 = this.getForwardDirection();
                // const s: THREE.Vector3 = this.getSideDirection();
                // console.log("Direction after : ", this.direction.x, ", ", this.direction.y, ", ", this.direction.z);

                // console.log("front vector : ", f.x, ", ", f.y, ", ", f.z);
                // console.log("side vector  : ", s.x, ", ", s.y, ", ", s.z);
                // console.log("Dot product : ", this.dotProduct(f, s));
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

        const rayDirection: THREE.Vector3 = this.direction.clone().normalize();
        const raycaster:    THREE.Raycaster =
        new THREE.Raycaster(this.camera.position, rayDirection);

        const objectsIntersected: THREE.Intersection[] = raycaster.intersectObjects(this.scene.children, true);

        if (objectsIntersected.length > 0 && objectsIntersected[0].distance < this.CAMERA_COLLISION_RADIUS) {
            console.log("Collision a : " + objectsIntersected[0].distance);
        }

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
        let sideDirection:  THREE.Vector3 = this.crossProduct(this.getForwardDirection(), yAxis);

        // console.log("side direction : " );
        // tslint:disable-next-line:max-line-length
        console.log("Direction side : " + sideDirection.x.toFixed(2) + ", " + sideDirection.y.toFixed(2) + ", " + sideDirection.z.toFixed(2));

        console.log("Direction x: " + this.direction.x);
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

    // private dotProduct (vector1: THREE.Vector3, vector2: THREE.Vector3): number {
    //     return (vector1.x * vector2.x) + (vector1.y * vector2.y) + (vector1.z * vector2.z);
    // }

    // poubelle
    // public getParentObject(object: THREE.Object3D): THREE.Object3D | null  {
    //     if (object === null) { return null; }
    //     if (object.parent === this.scene) { return object; }
    //     const parent: THREE.Object3D | null = object.parent;
    //     if (parent) { return this.getParentObject(parent); }

    //     return null;
    // }

}
