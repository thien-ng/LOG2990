import { Inject, Injectable } from "@angular/core";
import * as THREE from "three";
import { IPosition2D, ISceneObjectUpdate } from "../../../../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { Constants } from "../../../constants";
import { GameViewFreeService } from "../game-view-free.service";
import { ThreejsGenerator } from "./utilitaries/threejs-generator";
import { ThreejsMovement } from "./utilitaries/threejs-movement";
import { ThreejsRaycast } from "./utilitaries/threejs-raycast";

enum KEYS {
  W     = "w",
  A     = "a",
  S     = "s",
  D     = "d",
  T     = "t",
}

@Injectable()
export class ThreejsViewService {

  private readonly CAMERA_START_POSITION: number = 50;

  private scene:              THREE.Scene;
  private camera:             THREE.PerspectiveCamera;
  private renderer:           THREE.WebGLRenderer;
  private ambLight:           THREE.AmbientLight;
  private sceneVariables:     ISceneVariables<ISceneObject | IMesh>;
  private threejsGenerator:   ThreejsGenerator;
  private threejsMovement:    ThreejsMovement;
  private threejsRaycast:     ThreejsRaycast;

  private sceneIdById:        Map<number, number>;
  private idBySceneId:        Map<number, number>;
  private opacityById:        Map<number, number>;
  private originalColorById:  Map<number, string>;

  private moveForward:        boolean;
  private moveBackward:       boolean;
  private moveLeft:           boolean;
  private moveRight:          boolean;

  public constructor(@Inject(GameViewFreeService) public gameViewFreeService: GameViewFreeService) {

    this.init();
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
    this.threejsMovement      = new ThreejsMovement(this.camera);

    this.moveForward          = false;
    this.moveBackward         = false;
    this.moveRight            = false;
    this.moveLeft             = false;
  }

  public animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.renderObject();
  }

  public createScene(
    scene:            THREE.Scene,
    iSceneVariables:  ISceneVariables<ISceneObject | IMesh>,
    renderer:         THREE.WebGLRenderer,
    isSnapshotNeeded: boolean,
    arenaID: number): void {
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

    this.threejsRaycast = new ThreejsRaycast(this.camera, this.renderer, this.scene);
    this.threejsRaycast.setMaps(this.idBySceneId);
    this.threejsRaycast.setThreeGenerator(this.threejsGenerator);

    this.createLighting();
    this.generateSceneObjects(isSnapshotNeeded, arenaID);

    this.camera.lookAt(new THREE.Vector3(this.CAMERA_START_POSITION, this.CAMERA_START_POSITION, this.CAMERA_START_POSITION));
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

  public setupFront(orientation: number): void {
    this.threejsMovement.setupFront(orientation);
  }

  public rotateCamera(point: IPosition2D): void {
    this.threejsMovement.rotateCamera(point);
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

    this.gameViewFreeService.setPosition(mouseEvent);

    return this.threejsRaycast.detectObject(mouseEvent);
  }

  public updateSceneWithNewObject(object: ISceneObjectUpdate): void {
    this.threejsRaycast.updateSceneWithNewObject(object);
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

  private renderObject(): void {

    this.threejsMovement.movementCamera(this.moveForward, this.moveBackward, this.moveLeft, this.moveRight);

    this.renderer.render(this.scene, this.camera);
  }

  private generateSceneObjects(isSnapshotNeeded: boolean, arenaID: number): void {
    this.sceneVariables.sceneObjects.forEach((element: ISceneObject) => {
      this.threejsGenerator.initiateObject(element);
    });

    if (!isSnapshotNeeded) {
      this.gameViewFreeService.updateSceneLoaded(arenaID);
    }
  }

  public onKeyUp(keyboardEvent: KeyboardEvent): void {

    const keyValue: string = keyboardEvent.key.toLowerCase();

    switch ( keyValue ) {
      case KEYS.W:
        this.moveForward  = false;
        break;
      case KEYS.A:
        this.moveLeft     = false;
        break;
      case KEYS.S:
        this.moveBackward = false;
        break;
      case KEYS.D:
        this.moveRight    = false;
        break;

      default:
        break;
    }
  }

  public onKeyDown(keyboardEvent: KeyboardEvent): void {

    const keyValue: string = keyboardEvent.key.toLowerCase();

    switch ( keyValue ) {
      case KEYS.W:
        this.setupFront(-1);
        this.moveForward  = true;
        break;

      case KEYS.A:
        this.moveLeft     = true;
        break;

      case KEYS.S:
        this.setupFront(1);
        this.moveBackward = true;
        break;

      case KEYS.D:
        this.moveRight    = true;
        break;

      default:
        break;
    }
  }

}
