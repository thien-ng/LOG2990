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
    private sceneIdById:            Map<number, number>;
    private threejsGenerator:       ThreejsGenerator;
    private threejsThemeGenerator:  ThreejsThemeGenerator;
    private isTheme:                boolean;

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

    public setMaps(idBySceneId: Map<number, number>, sceneIdById: Map<number, number>): void {
        this.idBySceneId = idBySceneId;
        this.sceneIdById = sceneIdById;
    }

    public setThreeGenerator(threejsGenerator: ThreejsGenerator | ThreejsThemeGenerator): void {
      this.isTheme = threejsGenerator instanceof ThreejsThemeGenerator;
      this.isTheme ?  this.threejsThemeGenerator = threejsGenerator as ThreejsThemeGenerator :
                      this.threejsGenerator = threejsGenerator as ThreejsGenerator;
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
            const parentID: number = parent.id;

            return this.idBySceneId.get(parentID) as number;
          }
        }

        return -1;
    }

    public getParentObject(object: THREE.Object3D): THREE.Object3D | null  {

      if (object === null) {
        return null;
      }
      if (object.parent === this.scene) {
        return object;
      }

      const parent: THREE.Object3D | null = object.parent;

      if (parent) {
        return this.getParentObject(parent);
      }

      return null;
    }

    public updateSceneWithNewObject(sceneUpdate: ISceneObjectUpdate<ISceneObject | IMesh>): void {

        if (!sceneUpdate.sceneObject) {
            return;
        }

        switch (sceneUpdate.actionToApply) {

            case ActionType.ADD:
              this.isTheme ?  this.displayObject(sceneUpdate) :
                              this.threejsGenerator.initiateObject(sceneUpdate.sceneObject as ISceneObject);
              break;

            case ActionType.DELETE:
              this.deleteObject(sceneUpdate.sceneObject.id);
              break;

            case ActionType.CHANGE_COLOR:
              this.changeObjectColor(sceneUpdate);
              break;

            default:
              break;
          }
    }

    private displayObject(sceneUpdate: ISceneObjectUpdate<ISceneObject | IMesh>): void {
      if (!sceneUpdate.sceneObject) {
        return;
      }
      const objectID: number | undefined = this.sceneIdById.get(sceneUpdate.sceneObject.id);
      if (objectID) {
        const object: THREE.Object3D | undefined = this.scene.getObjectById(objectID);
        if (object) {
          this.threejsThemeGenerator.getOpacityById().set(sceneUpdate.sceneObject.id, 1);
          this.threejsThemeGenerator.setObjectOpacity(object, 1);
        }
      }
    }

    private deleteObject(id: number): void {
      this.isTheme ? this.threejsThemeGenerator.deleteObject(id) : this.threejsGenerator.deleteObject(id);
    }

    private changeObjectColor(sceneUpdate: ISceneObjectUpdate<ISceneObject | IMesh>): void {
      if (this.isTheme && sceneUpdate.sceneObject) {
        this.threejsThemeGenerator.changeObjectColor(sceneUpdate.sceneObject as IMesh);
      } else {
        const sceneObjectToUpdate: ISceneObject = sceneUpdate.sceneObject as ISceneObject;
        if (sceneObjectToUpdate) {
          this.threejsGenerator.changeObjectColor(sceneObjectToUpdate.id, sceneObjectToUpdate.color);
        }
      }
    }

}
