import * as THREE from "three";
import { IAxisValues, ISceneObject, SceneObjectType} from "../../../../../../../common/communication/iSceneObject";

export class ThreejsThemeGenerator {

  private setObjectRotation(object3D: THREE.Mesh, orientation: IAxisValues): void {
    object3D.rotation.x = orientation.x;
    object3D.rotation.y = orientation.y;
    object3D.rotation.z = orientation.z;
  }
}
