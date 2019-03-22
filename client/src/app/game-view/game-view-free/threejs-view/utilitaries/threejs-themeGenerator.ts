import * as THREE from "three";
import { IAxisValues, ISceneObject, SceneObjectType} from "../../../../../../../common/communication/iSceneObject";

export class ThreejsThemeGenerator {

  private readonly NUMBER_CORNERS_PYRAMID:  number = 3;
  private readonly INFINITE_CORNERS:        number = 1000;

  public constructor(
    private scene:                 THREE.Scene,
    private sceneIdById:           Map<number, number>,
    private originalColorById:     Map<number, string>,
    private idBySceneId:           Map<number, number>,
    private opacityById:           Map<number, number>) {}

  public initiateObject(object3D: ISceneObject): void {

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

  }

  private addObjectIdToMap(objectId: number, generatedObjectId: number): void {

    if (this.sceneIdById && this.idBySceneId) {
      this.sceneIdById.set(objectId, generatedObjectId);
      this.idBySceneId.set(generatedObjectId, objectId);
    }
  }

  private addObjectToScene(object3D: THREE.Mesh, position: IAxisValues, orientation: IAxisValues): void {
    this.setObjectPosition(object3D, position);
    this.setObjectRotation(object3D, orientation);

    this.scene.add(object3D);
  }

  private setObjectPosition(object3D: THREE.Mesh, position: IAxisValues): void {
    object3D.position.x = position.x;
    object3D.position.y = position.y;
    object3D.position.z = position.z;
  }

  private setObjectRotation(object3D: THREE.Mesh, orientation: IAxisValues): void {
    object3D.rotation.x = orientation.x;
    object3D.rotation.y = orientation.y;
    object3D.rotation.z = orientation.z;
  }
}
