import * as THREE from "three";
import { IPosition2D } from "../../../../../../../common/communication/iGameplay";

export class ThreejsMovement {

    private readonly CAMERA_MOVEMENT_SPEED:   number = 2;
    private readonly CAMERA_ROTATION_SPEED:   number = 0.01;
    private readonly CAMERA_COLLISION_RADIUS: number = 5;

    private velocity:   THREE.Vector3;
    private direction:  THREE.Vector3;
    private pointingAt: THREE.Vector3;
    private mouseIsClicked: boolean;
    // private front:      THREE.Vector3;
    // private orthogonal: THREE.Vector3;
    private objettttt:  THREE.Mesh;

        this.velocity   = new THREE.Vector3(0, 0, 0);
        this.direction  = new THREE.Vector3(0, 0, 0);
        this.mouseIsClicked = false;
        // this.front      = new THREE.Vector3(0, 0, 0);
        // this.orthogonal = new THREE.Vector3(0, 0, 0);
        this.pointingAt = new THREE.Vector3(0, 0, 0);

        const geometry: THREE.SphereGeometry = new THREE.SphereGeometry( 0.1 );
        const material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        this.objettttt = new THREE.Mesh( geometry, material );
        scene.add( this.objettttt );
    }

    public rotateCamera(position: IPosition2D): void {
    public setMouseClickStatus(isClicked: boolean): void {
        this.mouseIsClicked = isClicked;
    }

    public movementCamera(moveForward: boolean, moveBackward: boolean, moveLeft: boolean, moveRight: boolean): void {

        if ( moveLeft ) {
        //   this.moveToSide(1);

        } else if ( moveRight ) {
        //   this.moveToSide(-1);
        }

        // this.direction = this.addVectors();
        // this.addVectors(this.front, this.orthogonal, this.direction);
        // this.direction.normalize();

        if ( moveForward || moveBackward || moveLeft || moveRight) {

            this.direction.z = Number(moveForward) - Number(moveBackward);
            this.direction.x = Number(moveRight)     - Number(moveLeft);
            console.log("Direction z " + this.direction.z);
            console.log("Direction x " + this.direction.x);
            console.log("");
            this.updatePointAt();
            this.bougeMaBoule();
            // this.updatePointAt();
            // this.bougeMaBoule();
            this.setCameraVelocity();
            // this.moveCameraTowards(this.pointingAt);
            this.translateCamera();
        } else {
            this.multiplyVector(this.velocity, 0);
        }
        // if (!this.detectCollisionInDirection(this.direction)) {
            // this.translateCamera();
        // }
    }

    // private getAimedDirection(commandDirection: THREE.Vector3): THREE.Vector3 {
    //     const front: THREE.Vector3 = this.getFront();
    //     const left: THREE.Vector3 = this.getLeft();

    //     // front.x *= this.direction.z;
    //     // front.y *= this.direction.z;
    //     front.z *= this.direction.z;

    //     left.x *= this.direction.x;
    //     // left.y *= this.direction.x;
    //     // left.z *= this.direction.x;

    //     this.pointingAt = this.addVectors(front, left);
    //     // this.addVectors(front, left, this.pointingAt);

    //     this.pointingAt.normalize();
    // }

    // private moveToSide(orientation: number): void {
    //     const frontvector:  THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    //     const yAxis:        THREE.Vector3 = new THREE.Vector3(0, orientation, 0);
    //     this.camera.getWorldDirection(frontvector);
    //     frontvector.z = frontvector.z * -1;
    //     this.orthogonal = this.crossProduct(frontvector, yAxis);
    // }

    private setCameraVelocity(): void {
        this.direction.normalize();
        // this.printVector("direction ", this.direction);
        this.velocity.x = this.direction.x * this.CAMERA_MOVEMENT_SPEED;
        this.velocity.y = this.direction.y * this.CAMERA_MOVEMENT_SPEED;
        this.velocity.z = -(this.direction.z * this.CAMERA_MOVEMENT_SPEED);
    }

    private updatePointAt(): void {
        const front: THREE.Vector3 = this.getFront();
        const left: THREE.Vector3 = this.getLeft();

        // front.x *= this.direction.z;
        // front.y *= this.direction.z;
        front.z *= this.direction.z;

        left.x *= this.direction.x;
        // left.y *= this.direction.x;
        // left.z *= this.direction.x;

        this.pointingAt = this.addVectors(front, left);
        // this.addVectors(front, left, this.pointingAt);

        this.pointingAt.normalize();
    }

    private getFront(): THREE.Vector3 {
        const front: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        this.camera.getWorldDirection(front);
        // this.printVector("front ", front);
        // front = this.multiplyVector(front, -1);

        // console.log("front: ", front);
        // this.printVector("front ", front);

        return front.normalize();
    }


    private getLeft(): THREE.Vector3 {
        const yAxis: THREE.Vector3 = new THREE.Vector3(0, -1, 0);
        const left: THREE.Vector3 = this.crossProduct(this.getFront(), yAxis);

        // left.x = left.x * -1;
        // left.y = left.y * -1;
        // left.z = left.z * -1;

        return left.normalize();
    }

    private bougeMaBoule(): void {
        this.boule.position.x = this.camera.position.x + -this.forward.x * (this.CAMERA_COLLISION_RADIUS + 1);
        this.boule.position.y = this.camera.position.y + -this.forward.y * (this.CAMERA_COLLISION_RADIUS + 1);
        this.boule.position.z = this.camera.position.z + -this.forward.z * (this.CAMERA_COLLISION_RADIUS + 1);
    }

    private translateCamera(): void {
        this.camera.translateX(this.velocity.x);
        this.camera.translateY(this.velocity.y);
        this.camera.translateZ(this.velocity.z);
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
