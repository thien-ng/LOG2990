import * as THREE from "three";
import { IAxisValues, ISceneObject, SceneObjectType} from "../../../../../../../common/communication/iSceneObject";

export class ThreejsGenerator {

  public constructor(private scene: THREE.Scene) {}

  public initiateObject(object3D: ISceneObject): void {

    switch (object3D.type) {
      case SceneObjectType.Sphere: {
        this.generateSphere(object3D);
        break;
      }
      
      case SceneObjectType.Cube: {
        this.generateCube(object3D);
        break;
      }

      case SceneObjectType.Cone: {
        this.generateCone(object3D);
        break;
      }

      case SceneObjectType.Cylinder: {
        this.generateCylinder(object3D);
        break;
      }

      case SceneObjectType.TriangularPyramid: {
        this.generateTriangularPyramid(object3D);
        break;
      }

      default: {
        break;
      }
    }
  }
  
  private generateSphere(object3D: ISceneObject): void {

    const generatedColor: THREE.MeshBasicMaterial = this.createObjectColor(object3D.color);
    const sphereGeometry: THREE.Geometry = new THREE.SphereGeometry(object3D.scale.x);
    const generatedObject: THREE.Mesh = new THREE.Mesh(sphereGeometry, generatedColor);

    this.addObjectToScene(generatedObject, object3D.position, object3D.rotation);
  }

  private generateCube(object3D: ISceneObject): void {

    const generatedColor: THREE.MeshBasicMaterial = this.createObjectColor(object3D.color);
    const sphereGeometry: THREE.Geometry = new THREE.CubeGeometry(
                                                              object3D.scale.x,
                                                              object3D.scale.z,
                                                              object3D.scale.y);
    const generatedObject: THREE.Mesh = new THREE.Mesh(sphereGeometry, generatedColor);

    this.addObjectToScene(generatedObject, object3D.position, object3D.rotation);
  }

  private generateCone(object3D: ISceneObject): void {

    const generatedColor: THREE.MeshBasicMaterial = this.createObjectColor(object3D.color);
    const sphereGeometry: THREE.Geometry = new THREE.ConeGeometry(
                                                              object3D.scale.x,
                                                              object3D.scale.z,
                                                              1000);
    const generatedObject: THREE.Mesh = new THREE.Mesh(sphereGeometry, generatedColor);

    this.addObjectToScene(generatedObject, object3D.position, object3D.rotation);
  }

  private generateCylinder(object3D: ISceneObject): void {

    const generatedColor: THREE.MeshBasicMaterial = this.createObjectColor(object3D.color);
    const sphereGeometry: THREE.Geometry = new THREE.CylinderGeometry(
                                                              object3D.scale.x,
                                                              object3D.scale.x,
                                                              object3D.scale.y,
                                                              1000);
    const generatedObject: THREE.Mesh = new THREE.Mesh(sphereGeometry, generatedColor);

    this.addObjectToScene(generatedObject, object3D.position, object3D.rotation);
  }

  private generateTriangularPyramid(object3D: ISceneObject): void {

    const generatedColor: THREE.MeshBasicMaterial = this.createObjectColor(object3D.color);
    const sphereGeometry: THREE.Geometry = new THREE.ConeGeometry(
                                                              object3D.scale.x,
                                                              object3D.scale.z,
                                                              3);
    const generatedObject: THREE.Mesh = new THREE.Mesh(sphereGeometry, generatedColor);

    this.addObjectToScene(generatedObject, object3D.position, object3D.rotation);
  }

  private createObjectColor(colorHex: string): THREE.MeshBasicMaterial {
    return new THREE.MeshPhongMaterial({color: colorHex});;
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

  private setObjectRotation(object3D: THREE.Mesh, orientation: IAxisValues) {

    object3D.rotation.x = orientation.x;
    object3D.rotation.y = orientation.y;
    object3D.rotation.z = orientation.z;
  }

}