import { Inject, Injectable } from "@angular/core";
import * as THREE from "three";
import { IPosition2D, ISceneObjectUpdate } from "../../../../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { CClient } from "../../../CClient";
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

  public  handleId:           number;
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
      CClient.FIELD_OF_VIEW,
      windowRatio,
      CClient.MIN_VIEW_DISTANCE,
      CClient.MAX_VIEW_DISTANCE,
    );

    this.ambLight             = new THREE.AmbientLight(CClient.AMBIENT_LIGHT_COLOR, CClient.AMBIENT_LIGHT_INTENSITY);
    this.sceneIdById          = new Map<number, number>();
    this.idBySceneId          = new Map<number, number>();
    this.opacityById          = new Map<number, number>();
    this.originalColorById    = new Map<number, string>();
    this.moveForward          = false;
    this.moveBackward         = false;
    this.moveRight            = false;
    this.moveLeft             = false;
  }

  public animate(): void {
    this.handleId = requestAnimationFrame(this.animate.bind(this));
    this.renderScene();
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

    this.threejsMovement      = new ThreejsMovement(this.camera, this.scene);

    this.renderer.setSize(CClient.SCENE_WIDTH, CClient.SCENE_HEIGHT);
    this.renderer.setClearColor(this.sceneVariables.sceneBackgroundColor);

    this.threejsRaycast = new ThreejsRaycast(this.camera, this.renderer, this.scene);
    this.threejsRaycast.setMaps(this.idBySceneId, this.sceneIdById);
    this.threejsRaycast.setThreeGenerator(this.threejsGenerator);

    this.createLighting();
    this.generateSceneObjects(isSnapshotNeeded, arenaID);
    this.setWalls();

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

    this.gameViewFreeService.setPosition(mouseEvent.offsetX, mouseEvent.offsetY);

    return this.threejsRaycast.detectObject(mouseEvent);
  }

  public updateSceneWithNewObject(object: ISceneObjectUpdate<ISceneObject | IMesh>): void {
    this.threejsRaycast.updateSceneWithNewObject(object);
  }

  private createLighting(): void {

    const firstLight:   THREE.DirectionalLight = new THREE.DirectionalLight(CClient.FIRST_LIGHT_COLOR, CClient.FIRST_LIGHT_INTENSITY);
    const secondLight:  THREE.DirectionalLight = new THREE.DirectionalLight(CClient.SECOND_LIGHT_COLOR, CClient.SECOND_LIGHT_INTENSITY);

    firstLight.position.set(CClient.FIRST_LIGHT_POSITION_X, CClient.FIRST_LIGHT_POSITION_Y, CClient.FIRST_LIGHT_POSITION_Z);
    secondLight.position.set(CClient.SECOND_LIGHT_POSITION_X, CClient.SECOND_LIGHT_POSITION_Y, CClient.SECOND_LIGHT_POSITION_Z);

    this.scene.add(firstLight);
    this.scene.add(secondLight);
    this.scene.add(this.ambLight);
  }

  private buildWall(rotationWanted: THREE.Vector3, translationWanted: THREE.Vector3): void {
      const plane: THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(
      CClient.FLOOR_DIMENTION, CClient.FLOOR_DIMENTION, CClient.FLOOR_SEGMENT, CClient.FLOOR_SEGMENT);
      const wallMaterial:  THREE.MeshBasicMaterial   = new THREE.MeshBasicMaterial(
      { color: 0x000000, transparent: true, opacity: 0, side: THREE.DoubleSide });
      const wall: THREE.Mesh = new THREE.Mesh(plane, wallMaterial);
      this.rotateWall(wall, rotationWanted);
      this.moveWall(wall, translationWanted);

      this.scene.add(wall);
    }

  private rotateWall(wall: THREE.Mesh, rotationWanted: THREE.Vector3): void {
    wall.rotateX(rotationWanted.x);
    wall.rotateY(rotationWanted.y);
    wall.rotateZ(rotationWanted.z);
  }

  private moveWall(wall: THREE.Mesh, translationWanted: THREE.Vector3): void {
    wall.position.x = translationWanted.x !== 0 ? translationWanted.x : wall.position.x;
    wall.position.y = translationWanted.y !== 0 ? translationWanted.y : wall.position.y;
    wall.position.z = translationWanted.z !== 0 ? translationWanted.z : wall.position.z;
  }

  private setWalls(): void {
    const maxDistance: number = 200;
    const minDistance: number = -100;
    const verticalAngle: number = - Math.PI / CClient.FLOOR_DIVIDER;
    this.buildWall(new THREE.Vector3(0, verticalAngle, 0), new THREE.Vector3(minDistance, 0, 0));
    this.buildWall(new THREE.Vector3(0, verticalAngle, 0), new THREE.Vector3( maxDistance, 0, 0));
    this.buildWall(new THREE.Vector3(0, 0, verticalAngle), new THREE.Vector3(0, 0,  maxDistance));
    this.buildWall(new THREE.Vector3(0, 0, verticalAngle), new THREE.Vector3(0, 0, minDistance));
    this.buildWall(new THREE.Vector3(verticalAngle, 0, 0), new THREE.Vector3(0, maxDistance, 0));
    this.buildWall(new THREE.Vector3(verticalAngle, 0, 0), new THREE.Vector3(0, minDistance, 0));
  }

  private renderScene(): void {

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

  public onKeyMovement(keyboardEvent: KeyboardEvent, buttonStatus: boolean): void {
    const keyValue: string = keyboardEvent.key.toLowerCase();

    switch ( keyValue ) {
      case KEYS.W:
        this.moveForward  = buttonStatus;
        break;
      case KEYS.A:
        this.moveLeft     = buttonStatus;
        break;
      case KEYS.S:
        this.moveBackward = buttonStatus;
        break;
      case KEYS.D:
        this.moveRight    = buttonStatus;
        break;
      default:
        break;
    }
  }
}
