import { Inject, Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import * as THREE from "three";
import GLTFLoader from "three-gltf-loader";
import { IPosition2D, ISceneObjectUpdate } from "../../../../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../../../../common/communication/iSceneObject";
import { IMeshInfo, ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { CClient } from "../../../CClient";
import { GameViewFreeService } from "../game-view-free.service";
import { ThreejsMovement } from "./utilitaries/threejs-movement";
import { ThreejsRaycast } from "./utilitaries/threejs-raycast";
import { ThreejsThemeGenerator } from "./utilitaries/threejs-themeGenerator";

enum KEYS { W = "w", A = "a", S = "s", D = "d", T = "t"}

@Injectable()
export class ThreejsThemeViewService {

  private readonly CAMERA_START_POSITION: number = 50;

  private scene:                THREE.Scene;
  private camera:               THREE.PerspectiveCamera;
  private renderer:             THREE.WebGLRenderer;
  private ambLight:             THREE.AmbientLight;
  private sceneVariables:       ISceneVariables<ISceneObject | IMesh>;
  private meshInfos:            IMeshInfo[];
  private threejsGenerator:     ThreejsThemeGenerator;
  private threejsThemeRaycast:  ThreejsRaycast;
  private threejsMovement:      ThreejsMovement;
  private modelsByName:         Map<string, THREE.Object3D>;
  private gltfByUrl:            Map<string, THREE.GLTF>;

  private sceneIdById:          Map<number, number>;
  private idBySceneId:          Map<number, number>;
  private opacityById:          Map<number, number>;

  private moveForward:        boolean;
  private moveBackward:       boolean;
  private moveLeft:           boolean;
  private moveRight:          boolean;

  private allPromises: Promise<{}>[] = [];

  public  handleId:             number;

  public constructor(
    private snackBar: MatSnackBar,
    @Inject(GameViewFreeService) public gameViewFreeService: GameViewFreeService) {
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
    this.gltfByUrl            = new Map<string, THREE.GLTF>();
    this.modelsByName         = new Map<string, THREE.Object3D>();
    this.moveForward          = false;
    this.moveBackward         = false;
    this.moveRight            = false;
    this.moveLeft             = false;

    this.setStartCameraRotation();
  }

  private setStartCameraRotation(): void {
    this.camera.rotation.x = 0;
    this.camera.rotation.y = 0;
    this.camera.rotation.z = 0;
  }

  public animate(): void {
    this.handleId = requestAnimationFrame(this.animate.bind(this));
    this.renderObject();
  }

  public async createScene(
    scene:            THREE.Scene,
    iSceneVariables:  ISceneVariables<ISceneObject | IMesh>,
    renderer:         THREE.WebGLRenderer,
    isSnapshotNeeded: boolean,
    arenaID: number,
    meshInfos?: IMeshInfo[]): Promise<void> {
    this.renderer         = renderer;
    this.scene            = scene;
    this.sceneVariables   = iSceneVariables;
    this.threejsMovement  = new ThreejsMovement(this.camera, this.scene);

    if (meshInfos) {
      this.meshInfos = meshInfos;
    }
    this.renderer.setSize(CClient.SCENE_WIDTH, CClient.SCENE_HEIGHT);
    this.renderer.setClearColor(this.sceneVariables.sceneBackgroundColor);

    await this.getModelObjects(this.meshInfos);
    this.threejsGenerator = new ThreejsThemeGenerator(
      this.scene,
      this.sceneIdById,
      this.idBySceneId,
      this.opacityById,
      this.modelsByName,
    );
    this.prepareRaycasts();
    this.createLighting();
    this.generateSceneObjects(isSnapshotNeeded, arenaID);
    this.setFloor();
    this.setWalls();
    this.setCameraPosition(CClient.CAMERA_POSITION_X, CClient.CAMERA_POSITION_Y, CClient.CAMERA_POSITION_Z);
    this.scene.fog = new THREE.Fog(CClient.FOG_COLOR, CClient.FOG_NEAR_DISTANCE, CClient.FOG_FAR_DISTANCE);
    this.camera.lookAt(new THREE.Vector3(this.CAMERA_START_POSITION, this.CAMERA_START_POSITION, this.CAMERA_START_POSITION));
  }

  private prepareRaycasts(): void {
    this.threejsThemeRaycast = new ThreejsRaycast(this.camera, this.renderer, this.scene);
    this.threejsThemeRaycast.setMaps(this.idBySceneId, this.sceneIdById);
    this.threejsThemeRaycast.setThreeGenerator(this.threejsGenerator);
  }

  private setFloor(): void {
    const floor:          THREE.PlaneBufferGeometry = new THREE.PlaneBufferGeometry(
      CClient.FLOOR_DIMENTION, CClient.FLOOR_DIMENTION, CClient.FLOOR_SEGMENT, CClient.FLOOR_SEGMENT);
    const floorMaterial:  THREE.MeshBasicMaterial   = new THREE.MeshBasicMaterial({ color: CClient.FLOOR_COLOR, side: THREE.DoubleSide });
    const plane:          THREE.Mesh                = new THREE.Mesh(floor, floorMaterial);
    plane.rotateX( - Math.PI / CClient.FLOOR_DIVIDER);
    this.scene.add(plane);
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
    const distance: number = 600;
    const verticalAngle: number = - Math.PI / CClient.FLOOR_DIVIDER;
    this.buildWall(new THREE.Vector3(0, verticalAngle, 0), new THREE.Vector3(-distance, 0, 0));
    this.buildWall(new THREE.Vector3(0, verticalAngle, 0), new THREE.Vector3( distance, 0, 0));
    this.buildWall(new THREE.Vector3(0, 0, verticalAngle), new THREE.Vector3(0, 0,  distance));
    this.buildWall(new THREE.Vector3(0, 0, verticalAngle), new THREE.Vector3(0, 0, -distance));
    this.buildWall(new THREE.Vector3(verticalAngle, 0, 0), new THREE.Vector3(0, distance, 0));
  }

  public changeObjectsColor(cheatColorActivated: boolean, isLastChange: boolean, modifiedList?: number[]): void {
    if (!modifiedList) {
      return;
    }
    modifiedList.forEach((differenceId: number) => {
      const meshObject:      THREE.Mesh | undefined = this.recoverObjectFromScene(differenceId);
      let opacityNeeded:     number                 = (cheatColorActivated) ? 0 : 1;

      if (isLastChange) {
        const originalOpacity: number = this.opacityById.get(differenceId) as number;
        opacityNeeded = originalOpacity;
      }
      if (meshObject) {
        this.threejsGenerator.setObjectOpacity(meshObject, opacityNeeded);
      }
    });
  }

  public setCameraPosition(x: number, y: number, z: number): void {
    this.camera.position.x = x;
    this.camera.position.y = y;
    this.camera.position.z = z;
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

  public updateSceneWithNewObject(object: ISceneObjectUpdate<ISceneObject | IMesh>): void {
    this.threejsThemeRaycast.updateSceneWithNewObject(object);
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
    this.getGLTFs(meshInfos);

    return Promise.all(this.allPromises).then(() => {
      meshInfos.forEach((meshInfo: IMeshInfo) => {
        const gtlf: THREE.GLTF | undefined = this.gltfByUrl.get(meshInfo.GLTFUrl);
        if (gtlf) {
          gtlf.scene.traverse((child: THREE.Object3D) => {
            if (child.name === meshInfo.uuid) { this.modelsByName.set(child.name, child); }
          });
        }
      });
    }).catch((error) => this.openSnackBar(error.message, CClient.SNACK_ACTION));

  }

  private getGLTFs (meshInfos: IMeshInfo[]): void {
    meshInfos.forEach(async (meshInfo: IMeshInfo) => {
      const meshUrl: string = CClient.PATH_TO_MESHES + "/" + meshInfo.GLTFUrl;
      if (!this.gltfByUrl.has(meshUrl)) {
        this.allPromises.push(new Promise( (resolve, reject) => {
          new GLTFLoader().load(meshUrl, (gltf: THREE.GLTF) => {
            this.gltfByUrl.set(meshInfo.GLTFUrl, gltf);
            resolve(gltf);
        },                      undefined, reject);
        }));
      }
    });
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

  private openSnackBar(msg: string, action: string): void {
    this.snackBar.open(msg, action, {duration: CClient.SNACKBAR_DURATION, verticalPosition: "top"});
  }
}
