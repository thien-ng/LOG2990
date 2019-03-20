import { Inject, Injectable } from "@angular/core";
import * as THREE from "three";
import { ActionType, ISceneObjectUpdate } from "../../../../../../common/communication/iGameplay";
import { ISceneObject } from "../../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { Constants } from "../../../constants";
import { GameViewFreeService } from "../game-view-free.service";
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
  private sceneIdById:            Map<number, number>;
  private idBySceneId:            Map<number, number>;
  private opacityById:            Map<number, number>;
  private originalColorById:      Map<number, string>;

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
    this.mouse                = new THREE.Vector3();
    this.raycaster            = new THREE.Raycaster();
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
    this.gameViewFreeService.position.x = mouseEvent.offsetX;
    this.gameViewFreeService.position.y = mouseEvent.offsetY;

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

  private renderObject(): void {

    this.camera.lookAt(Constants.CAMERA_LOOK_AT_X, Constants.CAMERA_LOOK_AT_Y, Constants.CAMERA_LOOK_AT_Z);
    this.renderer.render(this.scene, this.camera);
  }

  private generateSceneObjects(): void {
    this.sceneVariables.sceneObjects.forEach((element: ISceneObject) => {
      this.threejsGenerator.initiateObject(element);
    });
  }

}
