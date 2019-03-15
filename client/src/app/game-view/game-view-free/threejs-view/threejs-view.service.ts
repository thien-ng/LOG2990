import { Injectable } from "@angular/core";
import * as THREE from "three";
import { ISceneObject } from "../../../../../../common/communication/iSceneObject";
import { IModification, ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { Constants } from "../../../constants";
import { ThreejsGenerator } from "./utilitaries/threejs-generator";

@Injectable()
export class ThreejsViewService {

  private CHEAT_COLOR:            string = "#FF0000";

  private scene:                  THREE.Scene;
  private camera:                 THREE.PerspectiveCamera;
  private renderer:               THREE.WebGLRenderer;
  private ambLight:               THREE.AmbientLight;
  private sceneVariable:          ISceneVariables;
  private threejsGenerator:       ThreejsGenerator;
  private modifiedMap:            Map<number, number>;
  private mapOriginColor:         Map<number, string>;

  public constructor() {
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

  public changeObjectsColor(modifiedList: IModification[], isCheating: boolean): void {

    modifiedList.forEach((modificationElement: IModification) => {
      const meshObject: THREE.Mesh | undefined = this.recoverObjectFromScene(modificationElement.id);

      if (meshObject !== undefined) {
        const objectColor: string | undefined = this.mapOriginColor.get(modificationElement.id);
        const chosenColor: string | undefined = (!isCheating) ? this.CHEAT_COLOR : objectColor;

        meshObject.material = new THREE.MeshPhongMaterial({color: chosenColor});
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

  private renderObject(): void {
    const speed: number     = Date.now() * Constants.SPEED_FACTOR;

    this.camera.position.x  = Math.cos(speed) * Constants.POSITION_FACTOR;

    this.camera.lookAt(Constants.CAMERA_LOOK_AT_X, Constants.CAMERA_LOOK_AT_Y, Constants.CAMERA_LOOK_AT_Z);
    this.renderer.render(this.scene, this.camera);
  }

  private generateSceneObjects(): void {
    this.sceneVariable.sceneObjects.forEach((element: ISceneObject) => {
      this.threejsGenerator.initiateObject(element);
    });
  }
}
