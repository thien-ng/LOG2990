import * as THREE from "three";
import { ActionType, ISceneObjectUpdate } from "../../../../../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../../../../../common/communication/iSceneObject";
import { ThreejsGenerator } from "./threejs-generator";
import { ThreejsThemeGenerator } from "./threejs-themeGenerator";

export class ThreejsRaycast {

  private readonly NORMALIZE_FACTOR: number = 2;

  private renderer:               THREE.WebGLRenderer;
  private camera:                 THREE.PerspectiveCamera;
  private scene:                  THREE.Scene;
  private mouse:                  THREE.Vector3;
  private raycaster:              THREE.Raycaster;
  private idBySceneId:            Map<number, number>;
  private threejsGenerator:       ThreejsGenerator;
  private threejsThemeGenerator:  ThreejsThemeGenerator;
  private isTheme:                boolean;
  private modelsByName:           Map<string, THREE.Object3D>;

  public constructor(
      camera:   THREE.PerspectiveCamera,
      renderer: THREE.WebGLRenderer,
      scene:    THREE.Scene) {
      this.camera   = camera;
      this.renderer = renderer;
      this.scene    = scene;

      this. mouse     = new THREE.Vector3();
      this.raycaster  = new THREE.Raycaster();
  }

  public setMaps(idBySceneId: Map<number, number>): void {
      this.idBySceneId = idBySceneId;
  }

  public setModelsByNameMap(modelsByName: Map<string, THREE.Object3D>): void {
    this.modelsByName = modelsByName;
  }

  public setThreeGenerator(threejsGenerator: ThreejsGenerator | ThreejsThemeGenerator): void {
    this.isTheme = threejsGenerator instanceof ThreejsThemeGenerator;
    if (this.isTheme) {
      this.threejsThemeGenerator  = threejsGenerator as ThreejsThemeGenerator;
    } else {
      this.threejsGenerator       = threejsGenerator as ThreejsGenerator;
    }
  }

  public detectObject(mouseEvent: MouseEvent): number {
    mouseEvent.preventDefault();
    this.mouse.x =   ( mouseEvent.offsetX / this.renderer.domElement.clientWidth ) * this.NORMALIZE_FACTOR - 1;
    this.mouse.y = - ( mouseEvent.offsetY / this.renderer.domElement.clientHeight ) * this.NORMALIZE_FACTOR + 1;
    this.mouse.z = 0;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const objectsIntersected: THREE.Intersection[] = this.raycaster.intersectObjects(this.scene.children, true);

    if (objectsIntersected.length > 0) {

      const clickedObject: THREE.Object3D = objectsIntersected[0].object;
      const parent: THREE.Object3D | null = this.getParentObject(clickedObject);

      if (parent) {
        this.scene.remove(parent);
      }
      if (parent) {
      const firstIntersectedId: number = parent.id;

      return this.idBySceneId.get(firstIntersectedId) as number;
      }
    }

    return -1;
  }

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const objectsIntersected: THREE.Intersection[] = this.raycaster.intersectObjects(this.scene.children, true);
        if (objectsIntersected.length > 0) {
          const firstIntersectedId: number = objectsIntersected[0].object.id;

          return this.idBySceneId.get(firstIntersectedId) as number;
        }

        return -1;
    }

    public updateSceneWithNewObject(sceneUpdate: ISceneObjectUpdate<ISceneObject | IMesh>): void {

        if (!sceneUpdate.sceneObject) {
            return;
        }

        switch (sceneUpdate.actionToApply) {

            case ActionType.ADD:
              this.initiateObject(sceneUpdate);
              break;

            case ActionType.DELETE:
              this.threejsGenerator.deleteObject(sceneUpdate.sceneObject.id);
              break;

            case ActionType.CHANGE_COLOR:
              this.changeObjectColor(sceneUpdate);
              break;

            default:
              break;
          }
    }

    private initiateObject(sceneUpdate: ISceneObjectUpdate<ISceneObject | IMesh>): void {
      if (this.isTheme) {
        this.threejsThemeGenerator.initiateObject(sceneUpdate.sceneObject as IMesh, this.modelsByName);
      } else {
        this.threejsGenerator.initiateObject(sceneUpdate.sceneObject as ISceneObject);
      }
    }

    private changeObjectColor(sceneUpdate: ISceneObjectUpdate<ISceneObject | IMesh>): void {
      if (this.isTheme) {
        this.threejsThemeGenerator.changeObjectColor();
      } else {
        const sceneObjectToUpdate: ISceneObject = sceneUpdate.sceneObject as ISceneObject;
        if (sceneObjectToUpdate) {
          this.threejsGenerator.changeObjectColor(sceneObjectToUpdate.id, sceneObjectToUpdate.color);
        }
      }
    }
}
