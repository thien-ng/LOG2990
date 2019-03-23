import * as THREE from "three";
import { IMesh} from "../../../../../../../common/communication/iSceneObject";
import { IVector3D } from "../../../../../../../common/communication/iSceneVariables";

export class ThreejsThemeGenerator {

  public constructor(
    private scene:                 THREE.Scene,
    private sceneIdById:           Map<number, number>,
    private originalColorById:     Map<number, string>, // _TODO: a enlever?
    private idBySceneId:           Map<number, number>,
    private opacityById:           Map<number, number>,
    ) {}

  public initiateObject(mesh: IMesh, modelsByName: Map<string, THREE.Object3D>): void {

    const model3D: THREE.Object3D | undefined = modelsByName.get(mesh.meshName);

    if (model3D) {
      const object3D: THREE.Object3D = model3D.clone();

      this.initObject3D(mesh, object3D);
    }
  }

  private initObject3D (mesh: IMesh, object3D: THREE.Object3D): void {
    this.setObjectPosition(object3D, mesh.position);
    this.setObjectRotation(object3D, mesh.rotation);
    this.setObjectScale(object3D, mesh.scale);
    this.addObjectIdToMap(mesh.id, object3D.id);

    const opacityUsed: number = (object3D.visible) ? 0 : 1;
    this.opacityById.set(object3D.id, opacityUsed);
    this.scene.add(object3D);
  }

  public deleteObject(id: number): void {
    const objectId:       number         = this.sceneIdById.get(id) as number;
    const objectToRemove: THREE.Object3D = this.scene.getObjectById(objectId) as THREE.Object3D;

    this.scene.remove(objectToRemove);
  }

  public changeObjectColor(id: number, color: string): void {
    const objectId:       number         = this.sceneIdById.get(id) as number;
    const objectToChange: THREE.Object3D = this.scene.getObjectById(objectId) as THREE.Object3D;
    const objectMesh:     THREE.Mesh     = objectToChange as THREE.Mesh;

    this.originalColorById.set(id, color);

    objectMesh.material = new THREE.MeshPhongMaterial({color: color});
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

  private setObjectScale(object3D: THREE.Object3D, orientation: IVector3D): void {
    object3D.scale.x = orientation.x;
    object3D.scale.y = orientation.y;
    object3D.scale.z = orientation.z;
  }
}
