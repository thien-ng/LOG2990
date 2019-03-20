import { Injectable } from "@angular/core";
import * as THREE from "three";
import { ActionType, ISceneObjectUpdate } from "../../../../../../common/communication/iGameplay";
import { ISceneObject } from "../../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { Constants } from "../../../constants";
import { ThreejsGenerator } from "./utilitaries/threejs-generator";

@Injectable(
  {providedIn: "root"},
)
export class ThreejsViewService {

  private readonly MULTIPLICATOR: number = 2;

  private scene:                  THREE.Scene;
  private camera:                 THREE.PerspectiveCamera;
  private renderer:               THREE.WebGLRenderer;
  private ambLight:               THREE.AmbientLight;
  private raycaster:              THREE.Raycaster;
  private mouse:                  THREE.Vector3;
  private sceneVariables:         ISceneVariables;
  private threejsGenerator:       ThreejsGenerator;
  private velocity:               THREE.Vector3;
  private direction:              THREE.Vector3;
  private front:                  THREE.Vector3;
  private orthogonal:             THREE.Vector3;
  public moveForward:             boolean;
  public moveBackward:            boolean;
  public moveLeft:                boolean;
  public moveRight:               boolean;
  public goUp:                    boolean;
  public goLow:                   boolean;
  private sceneIdById:            Map<number, number>;
  private idBySceneId:            Map<number, number>;
  private opacityById:            Map<number, number>;
  private originalColorById:      Map<number, string>;

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

    this.ambLight             = new THREE.AmbientLight(Constants.AMBIENT_LIGHT_COLOR, Constants.AMBIENT_LIGHT_INTENSITY);
    this.sceneIdById          = new Map<number, number>();
    this.idBySceneId          = new Map<number, number>();
    this.opacityById          = new Map<number, number>();
    this.originalColorById    = new Map<number, string>();
    this.mouse                = new THREE.Vector3();
    this.raycaster            = new THREE.Raycaster();

    this.velocity             = new THREE.Vector3(0, 0, 0);
    this.direction            = new THREE.Vector3(0, 0, 0);
    this.front                = new THREE.Vector3(0, 0, 0);
    this.orthogonal           = new THREE.Vector3(0, 0, 0);

    this.moveForward  = this.moveBackward = this.moveRight = this.moveLeft = this.goLow = this.goUp = false;
  }

  public animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.renderObject();
  }

  public createScene(scene: THREE.Scene, iSceneVariables: ISceneVariables, renderer: THREE.WebGLRenderer): void {
    this.renderer         = renderer;
    this.scene            = scene;
    this.sceneVariables   = iSceneVariables;
    this.threejsGenerator = new ThreejsGenerator(
      this.scene,
      this.sceneIdById,
      this.originalColorById,
      this.idBySceneId,
      this.opacityById,
    );

    this.renderer.setSize(Constants.SCENE_WIDTH, Constants.SCENE_HEIGHT);
    this.renderer.setClearColor(this.sceneVariables.sceneBackgroundColor);

    this.createLighting();
    this.generateSceneObjects();

    this.camera.lookAt(this.scene.position);
  }

  public changeObjectsColor(cheatColorActivated: boolean, isLastChange: boolean, modifiedList?: number[]): void {

    if (!modifiedList) {
      return;
    }

    modifiedList.forEach((differenceId: number) => {

      const meshObject:      THREE.Mesh | undefined = this.recoverObjectFromScene(differenceId);
      const objectColor:     string     | undefined = this.originalColorById.get(differenceId);
      let opacityNeeded:     number                 = (cheatColorActivated) ? 0 : 1;

      if (isLastChange) {

        const originalOpacity: number = this.opacityById.get(differenceId) as number;

        opacityNeeded = originalOpacity;
      }

      if (meshObject !== undefined) {
        meshObject.material = new THREE.MeshPhongMaterial({color: objectColor, opacity: opacityNeeded, transparent: true});
      }
    });
  }

  private recoverObjectFromScene(index: number): THREE.Mesh | undefined {

    const objectId: number = (this.sceneIdById.get(index)) as number;

    const instanceObject3D: THREE.Object3D | undefined = this.scene.getObjectById(objectId);

    if (instanceObject3D !== undefined) {
      return (instanceObject3D as THREE.Mesh);
    }

    return undefined;
  }

  public detectObject(mouseEvent: MouseEvent): number {
    mouseEvent.preventDefault();

    this.mouse.x =   ( mouseEvent.offsetX / this.renderer.domElement.clientWidth ) * this.MULTIPLICATOR - 1;
    this.mouse.y = - ( mouseEvent.offsetY / this.renderer.domElement.clientHeight ) * this.MULTIPLICATOR + 1;
    this.mouse.z = 0;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const objectsIntersected: THREE.Intersection[] = this.raycaster.intersectObjects(this.scene.children);

    if (objectsIntersected.length > 0) {
      const firstIntersectedId: number = objectsIntersected[0].object.id;

      return (this.idBySceneId.get(firstIntersectedId)) as number;
    }

    return -1;
  }

  public updateSceneWithNewObject(object: ISceneObjectUpdate): void {

    if (!object.sceneObject) {
      return;
    }

    switch (object.actionToApply) {

      case ActionType.ADD:
        this.threejsGenerator.initiateObject(object.sceneObject);
        break;

      case ActionType.DELETE:
        this.threejsGenerator.deleteObject(object.sceneObject.id);
        break;

      case ActionType.CHANGE_COLOR:
        this.threejsGenerator.changeObjectColor(object.sceneObject.id, object.sceneObject.color);
        break;

      default:
        break;
    }
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

    if (this.moveForward || this.moveBackward || this.moveLeft || this.moveRight || this.goUp || this.goLow) {

      this.direction.z = Number(this.moveBackward) - Number(this.moveForward);
      this.direction.x = Number(this.moveRight) - Number(this.moveLeft);
      this.direction.y = Number(this.goUp) - Number(this.goLow);

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
    this.sceneVariables.sceneObjects.forEach((element: ISceneObject) => {
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
