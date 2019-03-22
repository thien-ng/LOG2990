import * as THREE from "three";
import { IAxisValues, ISceneObject, SceneObjectType} from "../../../../../../../common/communication/iSceneObject";

export class ThreejsThemeGenerator {

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
