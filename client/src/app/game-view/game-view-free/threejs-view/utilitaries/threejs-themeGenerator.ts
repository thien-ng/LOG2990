import * as THREE from "three";
import { IMesh} from "../../../../../../../common/communication/iSceneObject";
import { IVector3D } from "../../../../../../../common/communication/iSceneVariables";

export class ThreejsThemeGenerator {

  public constructor(
    private scene:                 THREE.Scene,
    private sceneIdById:           Map<number, number>,
    private idBySceneId:           Map<number, number>,
    private opacityById:           Map<number, number>,
    private modelsByName:          Map<string, THREE.Object3D>,
    ) {}

  public initiateObject(mesh: IMesh, modelsByName: Map<string, THREE.Object3D>): void {

    const model3D: THREE.Object3D | undefined = modelsByName.get(mesh.meshInfo.uuid);
    if (model3D) {
      const object3D: THREE.Object3D = model3D.clone();
      object3D.children.forEach((child: THREE.Mesh) => {
        this.cloneMaterialRecursive(child);
      })
      if (mesh.hidden) {
        this.setObjectOpacity(object3D, 0);
      }
      this.initObject3D(mesh, object3D);
    }
  }

  private cloneMaterialRecursive(object3D: THREE.Mesh): void {
    if (object3D.material instanceof THREE.Material) {
      object3D.material = object3D.material.clone();
    } else if (Array.isArray(object3D.material)) {
      object3D.material.forEach((mat: THREE.Material) => {
        mat = mat.clone();
      });
    } else {
      object3D.children.forEach((child: THREE.Mesh) => {
        this.cloneMaterialRecursive(child);
      })
    }
  }

  private initObject3D (mesh: IMesh, object3D: THREE.Object3D): void {
    this.setObjectPosition(object3D, mesh.position);
    this.setObjectRotation(object3D, mesh.rotation);
    this.setObjectScale(object3D, mesh.scaleFactor);
    this.addObjectIdToMap(mesh.id, object3D.id);

    const opacityUsed: number = (mesh.hidden) ? 0 : 1;
    this.opacityById.set(mesh.id, opacityUsed);
    this.sceneIdById.set(object3D.id, mesh.id);
    this.scene.add(object3D);

    object3D.parent = this.scene;
  }

  public deleteObject(id: number): void {
    const objectId:       number         = this.sceneIdById.get(id) as number;
    const objectToRemove: THREE.Object3D = this.scene.getObjectById(objectId) as THREE.Object3D;

    this.scene.remove(objectToRemove);
  }

  public changeObjectColor(sceneObject: IMesh): void {
    this.deleteObject(sceneObject.id);
    this.initiateObject(sceneObject, this.modelsByName);
  }

  private addObjectIdToMap(objectId: number, generatedObjectId: number): void {

    if (this.sceneIdById && this.idBySceneId) {
      this.sceneIdById.set(objectId, generatedObjectId);
      this.idBySceneId.set(generatedObjectId, objectId);
    }
  }

  private setObjectPosition(object3D: THREE.Object3D, position: IVector3D): void {
    object3D.position.x = position.x;
    object3D.position.y = position.y;
    object3D.position.z = position.z;
  }

  private setObjectRotation(object3D: THREE.Object3D, orientation: IVector3D): void {
    object3D.rotation.x = orientation.x;
    object3D.rotation.y = orientation.y;
    object3D.rotation.z = orientation.z;
  }

  private setObjectScale(object3D: THREE.Object3D, scale: number): void {
    object3D.scale.x = scale;
    object3D.scale.y = scale;
    object3D.scale.z = scale;
  }

  public getOpacityById(): Map<number, number> {
    return this.opacityById;
  }

  public setObjectOpacity(object: THREE.Object3D, opacity: number): void {

    object.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        if (Array.isArray(child.material)) {

          child.material.forEach((mat: THREE.Material) => {
            mat.transparent = true;
            mat.opacity = opacity;
          });
        } else {
          child.material.transparent = true;
          child.material.opacity = opacity;
        }
      }
    });
  }

}
