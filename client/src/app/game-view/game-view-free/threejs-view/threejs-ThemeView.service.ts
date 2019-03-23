import { Inject, Injectable, Optional } from "@angular/core";
import * as THREE from "three";
import GLTFLoader from "three-gltf-loader";
import { IPosition2D, ISceneObjectUpdate } from "../../../../../../../common/communication/iGameplay";
import { IMesh } from "../../../../../../../common/communication/iSceneObject";
import { IMeshInfo, ISceneVariables } from "../../../../../../../common/communication/iSceneVariables";
import { Constants } from "../../../../constants";
import { GameViewFreeService } from "../../game-view-free.service";
import { ThreejsMovement } from "../utilitaries/threejs-movement";
import { ThreejsThemeGenerator } from "./threejs-themeGenerator";
import { ThreejsThemeRaycast } from "./threejs-themeRaycast";

enum KEYS {
  W     = "w",
  A     = "a",
  S     = "s",
  D     = "d",
  T     = "t",
}

@Injectable()
export class ThreejsThemeViewService {

  private readonly CAMERA_START_POSITION: number = 50;
  private readonly FOWARD_ORIENTATION:    number = -1;
  private readonly BACKWARD_ORIENTATION:  number = 1;

  private scene:                    THREE.Scene;
  private camera:                   THREE.PerspectiveCamera;
  private renderer:                 THREE.WebGLRenderer;
  private ambLight:                 THREE.AmbientLight;
  private sceneVariables:           ISceneVariables<IMesh>;
  private threejsGenerator:         ThreejsThemeGenerator;
  private threejsThemeRaycast:      ThreejsThemeRaycast;
  private threejsMovement:          ThreejsMovement;
  private modelsByName:             Map<string, THREE.Object3D>;
  private gltfByUrl:                Map<string, THREE.GLTF>;

  private sceneIdById:        Map<number, number>;
  private idBySceneId:        Map<number, number>;
  private opacityById:        Map<number, number>;
  private originalColorById:  Map<number, string>;

  private moveForward:        boolean;
  private moveBackward:       boolean;
  private moveLeft:           boolean;
  private moveRight:          boolean;

  public constructor(
    @Inject(GameViewFreeService) public gameViewFreeService: GameViewFreeService,
    @Optional() private meshInfos: IMeshInfo[]) {

    this.init();
  }

  private async init(): Promise<void> {
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
    this.originalColorById    = new Map<number, string>(); // _TODO: a enlever?
    this.threejsMovement      = new ThreejsMovement(this.camera);

    this.moveForward          = false;
    this.moveBackward         = false;
    this.moveRight            = false;
    this.moveLeft             = false;

    if (this.meshInfos) {
      await this.getModelObjects(this.meshInfos);
    }
  }

  public animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.renderObject();
  }

  public createScene(
    scene:            THREE.Scene,
    iSceneVariables:  ISceneVariables<IMesh>,
    renderer:         THREE.WebGLRenderer,
    isSnapshotNeeded: boolean,
    arenaID: number): void {
    this.renderer         = renderer;
    this.scene            = scene;
    this.sceneVariables   = iSceneVariables;
    this.threejsGenerator = new ThreejsThemeGenerator(
      this.scene,
      this.sceneIdById,
      this.originalColorById, // _TODO: a enlever?
      this.idBySceneId,
      this.opacityById,
    );

    this.renderer.setSize(Constants.SCENE_WIDTH, Constants.SCENE_HEIGHT);
    this.renderer.setClearColor(this.sceneVariables.sceneBackgroundColor);

    this.threejsThemeRaycast = new ThreejsThemeRaycast(this.camera, this.renderer, this.scene);
    this.threejsThemeRaycast.setMaps(this.idBySceneId);
    this.threejsThemeRaycast.setThreeGenerator(this.threejsGenerator);

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

    this.gameViewFreeService.setPosition(mouseEvent.offsetX, mouseEvent.offsetY);

    return this.threejsThemeRaycast.detectObject(mouseEvent);
  }

  public updateSceneWithNewObject(object: ISceneObjectUpdate): void {
    this.threejsThemeRaycast.updateSceneWithNewObject(object);
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

    this.sceneVariables.sceneObjects.forEach((mesh: IMesh) => {
      this.threejsGenerator.initiateObject(mesh, this.modelsByName);
    });

    if (!isSnapshotNeeded) {
      this.gameViewFreeService.updateSceneLoaded(arenaID);
    }
  }

  private async getModelObjects (meshInfos: IMeshInfo[]): Promise<void> {
    await this.getGLTFs(meshInfos);

    meshInfos.forEach((meshInfo: IMeshInfo) => {
      const gtlf: THREE.GLTF | undefined = this.gltfByUrl.get(meshInfo.GLTFUrl);
      if (gtlf) {
        gtlf.scene.traverse((child: THREE.Object3D) => {
          if (child.uuid === meshInfo.uuid) {
            this.modelsByName.set(meshInfo.GLTFUrl, child);
          }
        });
      }
    });
  }

  private async getGLTFs (meshInfos: IMeshInfo[]): Promise<void> {
    meshInfos.forEach(async (meshInfo: IMeshInfo) => {
      if (!this.gltfByUrl.has(meshInfo.GLTFUrl)) {
        const gltfObject: THREE.GLTF = await new Promise( (resolve, reject) => {
          new GLTFLoader().load(meshInfo.GLTFUrl, (gltf: THREE.GLTF) => {
            resolve(gltf);
        },                      undefined, reject);
        }).then((reponse) => {
          this.gltfByUrl.set(meshInfo.GLTFUrl, gltfObject);
        }).catch((error) => error);

    //     // const gltfObject: THREE.GLTF = await new Promise(
    //     //   (resolve, reject) => {
    //     //     new GLTFLoader().load(meshInfo.GLTFUrl, (gltf: THREE.GLTF) => {
    //     //       resolve(gltf);
    //     //   },                      undefined, reject);
    //     // });
    //     // this.gltfByUrl.set(meshInfo.GLTFUrl, gltfObject);
      }
    });
  }

  public onKeyMovement(keyboardEvent: KeyboardEvent, buttonStatus: boolean): void {
    const keyValue: string = keyboardEvent.key.toLowerCase();

    switch ( keyValue ) {
      case KEYS.W:
        if (buttonStatus) {
          this.threejsMovement.setupFront(this.FOWARD_ORIENTATION);
        }
        this.moveForward  = buttonStatus;
        break;

      case KEYS.A:
        this.moveLeft     = buttonStatus;
        break;

      case KEYS.S:
        if (buttonStatus) {
          this.threejsMovement.setupFront(this.BACKWARD_ORIENTATION);
        }
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
