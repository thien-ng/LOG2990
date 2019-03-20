import { Injectable } from "@angular/core";
import * as THREE from "three-full";
import { ISceneObject } from "../../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { Constants } from "../../../constants";
import { ThreejsGenerator } from "./utilitaries/threejs-generator";

@Injectable()
export class ThreejsViewService {

  private scene:                  THREE.Scene;
  private camera:                 THREE.PerspectiveCamera;
  private renderer:               THREE.WebGLRenderer;
  private ambLight:               THREE.AmbientLight;
  private sceneVariable:          ISceneVariables;
  private threejsGenerator:       ThreejsGenerator;
  private modifiedMap:            Map<number, number>;
  private mapOriginColor:         Map<number, string>;
  // const PLC: any = require("pointer-lock-controls");
  // private controls:               PLC.PointerLockControls;
  private velocity:               THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private direction:              THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private front:                  THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  private orthogonal:             THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  public moveForward:             boolean       = false;
  public moveBackward:            boolean       = false;
  public moveLeft:                boolean       = false;
  public moveRight:               boolean       = false;
  public canJump:                 boolean       = false;
  public goLow:                   boolean       = false;

  public constructor() {
    this.init();
  }

  public setupFront(orientation: number): void {
    this.camera.getWorldDirection(this.front);
    this.front.normalize(); // this ensures consistent movements in all directions
    this.multiplyVector(this.front, orientation);
  }

  private init(): void {
    const windowRatio: number = window.innerWidth / window.innerHeight;
    this.camera = new   THREE.PerspectiveCamera(
      Constants.FIELD_OF_VIEW,
      windowRatio,
      Constants.MIN_VIEW_DISTANCE,
      Constants.MAX_VIEW_DISTANCE,
    );

    this.ambLight       = new THREE.AmbientLight(Constants.AMBIENT_LIGHT_COLOR, Constants.AMBIENT_LIGHT_INTENSITY);
    this.modifiedMap    = new Map<number, number>();
    this.mapOriginColor = new Map<number, string>();
  }

  public createScene(scene: THREE.Scene, iSceneVariables: ISceneVariables, renderer: THREE.WebGLRenderer): void {
    this.renderer         = renderer;
    this.scene            = scene;
    this.sceneVariable    = iSceneVariables;
    this.threejsGenerator = new ThreejsGenerator(
      this.scene,
      this.modifiedMap,
      this.mapOriginColor,
    );

    this.renderer.setSize(Constants.SCENE_WIDTH, Constants.SCENE_HEIGHT);
    this.renderer.setClearColor(this.sceneVariable.sceneBackgroundColor);

    this.createLighting();
    this.generateSceneObjects();

    this.camera.lookAt(this.scene.position);
  }

  public changeObjectsColor(modifiedList: number[], cheatColorActivated: boolean): void {

    modifiedList.forEach((differenceId: number) => {
      const meshObject:     THREE.Mesh | undefined = this.recoverObjectFromScene(differenceId);
      const objectColor:    string     | undefined = this.mapOriginColor.get(differenceId);
      const opacityNeeded:  number                 = (cheatColorActivated) ? 0 : 1;

      if (meshObject !== undefined) {
        meshObject.material = new THREE.MeshPhongMaterial({color: objectColor, opacity: opacityNeeded, transparent: true});
      }
    });
  }

  private recoverObjectFromScene(index: number): THREE.Mesh | undefined {

    const objectId: number = (this.modifiedMap.get(index)) as number;

    const instanceObject3D: THREE.Object3D | undefined = this.scene.getObjectById(objectId);

    if (instanceObject3D !== undefined) {
      return (instanceObject3D as THREE.Mesh);
    }

    return undefined;
  }

  private createLighting(): void {

    const firstLight:   THREE.DirectionalLight = new THREE.DirectionalLight(Constants.FIRST_LIGHT_COLOR, Constants.FIRST_LIGHT_INTENSITY);
    const secondLight:  THREE.DirectionalLight = new THREE.DirectionalLight(Constants.SECOND_LIGHT_COLOR, Constants.SECOND_LIGHT_INTENSITY);

    firstLight.position.set(Constants.FIRST_LIGHT_POSITION_X, Constants.FIRST_LIGHT_POSITION_Y, Constants.FIRST_LIGHT_POSITION_Z);
    secondLight.position.set(Constants.SECOND_LIGHT_POSITION_X, Constants.SECOND_LIGHT_POSITION_Y, Constants.SECOND_LIGHT_POSITION_Z);

    this.scene.add(firstLight);
    this.scene.add(secondLight);
    this.scene.add(this.ambLight);
  }

  public animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.renderObject();
  }

  // tslint:disable-next-line:max-func-body-length
  private renderObject(): void {
    const speed: number = 1.0;

    if ( this.moveLeft ) {
      const frontvec: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
      const yaxis: THREE.Vector3 = new THREE.Vector3(0, -1, 0);
      this.camera.getWorldDirection(frontvec);
      this.crossProduct(frontvec, yaxis, this.orthogonal);

    } else if ( this.moveRight ) {
      const frontvec: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
      const yaxis: THREE.Vector3 = new THREE.Vector3(0, 1, 0);
      this.camera.getWorldDirection(frontvec);
      this.crossProduct(frontvec, yaxis, this.orthogonal);
    }

    this.addVectors(this.front, this.orthogonal, this.direction);
    this.direction.normalize();

    if (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight || this.canJump || this.goLow) {

      this.direction.z = Number(this.moveBackward) - Number(this.moveForward);
      this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
      this.direction.y = Number(this.canJump) - Number(this.goLow);

      this.velocity.x = this.direction.x * speed;
      this.velocity.y = this.direction.y * speed;
      this.velocity.z = this.direction.z * speed;

      this.velocity.normalize();
    } else {
        this.multiplyVector(this.velocity, 0);
    }
    this.camera.translateX( this.velocity.x );
    this.camera.translateY( this.velocity.y );
    this.camera.translateZ( this.velocity.z );

    this.renderer.render(this.scene, this.camera);
  }

  private generateSceneObjects(): void {
    this.sceneVariable.sceneObjects.forEach((element: ISceneObject) => {
      this.threejsGenerator.initiateObject(element);
    });
  }

  private multiplyVector (vector: THREE.Vector3, multiplier: number): void {
    vector.x *= multiplier;
    vector.y *= multiplier;
    vector.z *= multiplier;
}

  private addVectors (v1: THREE.Vector3, v2: THREE.Vector3, toVector: THREE.Vector3): void {
    toVector = new THREE.Vector3(0, 0, 0);
    toVector.x = v1.x + v2.x;
    toVector.y = v1.y + v2.y;
    toVector.z = v1.z + v2.z;
  }

  private crossProduct (v1: THREE.Vector3, v2: THREE.Vector3, toVector: THREE.Vector3): void {
    toVector = new THREE.Vector3(0, 0, 0);
    toVector.x = (v1.y * v2.z) - (v1.z * v2.y);
    toVector.y = (v1.x * v2.z) - (v1.z * v2.x);
    toVector.z = (v1.x * v2.y) - (v1.y * v2.x);
  }
}
