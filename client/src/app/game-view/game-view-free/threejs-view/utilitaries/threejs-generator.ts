import * as THREE from "three";
import { IAxisValues, ISceneObject, SceneObjectType} from "../../../../../../../common/communication/iSceneObject";

export class ThreejsGenerator {

  private readonly NUMBER_CORNERS_PYRAMID:  number = 3;
  private readonly INFINITE_CORNERS:        number = 1000;

  public constructor(
    private scene:          THREE.Scene,
    private modifiedMap:    Map<number, number>,
    private mapOriginColor: Map<number, string>,
    private modifiedMapIntersect:    Map<number, number>) {}

  public initiateObject(object3D: ISceneObject): void {

    switch (object3D.type) {
      case SceneObjectType.Cube:
        this.generateCube(object3D);
        break;
      case SceneObjectType.Cone:
        this.generateCone(object3D);
        break;
      case SceneObjectType.Cylinder:
        this.generateCylinder(object3D);
        break;
      case SceneObjectType.TriangularPyramid:
        this.generateTriangularPyramid(object3D);
        break;
      default:
        this.generateSphere(object3D);
        break;
    }
  }

  public deleteObject(id: number): void {
    const objectId: number = this.modifiedMap.get(id) as number;
    const objectToRemove: THREE.Object3D = this.scene.getObjectById(objectId) as THREE.Object3D;

    this.scene.remove(objectToRemove);
  }

  public changeObjectColor(id: number, color: string): void {
    const objectId: number = this.modifiedMap.get(id) as number;
    const objectToChange: THREE.Object3D = this.scene.getObjectById(objectId) as THREE.Object3D;
    const objectMesh: THREE.Mesh = objectToChange as THREE.Mesh;

    this.mapOriginColor.set(id, color);

    objectMesh.material = new THREE.MeshPhongMaterial({color: color});
  }

  private generateSphere(object3D: ISceneObject): void {
    const generatedColor:   THREE.MeshBasicMaterial = this.createObjectColor(object3D.color);
    const sphereGeometry:   THREE.Geometry          = new THREE.SphereGeometry(object3D.scale.x);
    const generatedObject:  THREE.Mesh              = new THREE.Mesh(sphereGeometry, generatedColor);

    this.addColorToMap(object3D.id, object3D.color);
    this.addObjectIdToMap(object3D.id, generatedObject.id);
    this.addObjectToScene(generatedObject, object3D.position, object3D.rotation);
  }

  private generateCube(object3D: ISceneObject): void {

    const generatedColor:   THREE.MeshBasicMaterial = this.createObjectColor(object3D.color);
    const cubeGeometry:     THREE.Geometry          = new THREE.BoxGeometry(
      object3D.scale.x,
      object3D.scale.z,
      object3D.scale.y,
    );

    const generatedObject:  THREE.Mesh = new THREE.Mesh(cubeGeometry, generatedColor);

    this.addColorToMap(object3D.id, object3D.color);
    this.addObjectIdToMap(object3D.id, generatedObject.id);
    this.addObjectToScene(generatedObject, object3D.position, object3D.rotation);
  }

  private generateCone(object3D: ISceneObject): void {

    const generatedColor:   THREE.MeshBasicMaterial = this.createObjectColor(object3D.color);
    const coneGeometry:     THREE.Geometry          = new THREE.ConeGeometry(
      object3D.scale.x,
      object3D.scale.y,
      this.INFINITE_CORNERS,
    );

    const generatedObject: THREE.Mesh = new THREE.Mesh(coneGeometry, generatedColor);

    this.addColorToMap(object3D.id, object3D.color);
    this.addObjectIdToMap(object3D.id, generatedObject.id);
    this.addObjectToScene(generatedObject, object3D.position, object3D.rotation);
  }

  private generateCylinder(object3D: ISceneObject): void {

    const generatedColor:   THREE.MeshBasicMaterial = this.createObjectColor(object3D.color);
    const cylinderGeometry: THREE.Geometry          = new THREE.CylinderGeometry(
      object3D.scale.x,
      object3D.scale.x,
      object3D.scale.y,
      this.INFINITE_CORNERS,
    );

    const generatedObject:  THREE.Mesh = new THREE.Mesh(cylinderGeometry, generatedColor);

    this.addColorToMap(object3D.id, object3D.color);
    this.addObjectIdToMap(object3D.id, generatedObject.id);
    this.addObjectToScene(generatedObject, object3D.position, object3D.rotation);
  }

  private generateTriangularPyramid(object3D: ISceneObject): void {

    const generatedColor:   THREE.MeshBasicMaterial = this.createObjectColor(object3D.color);
    const pyramidGeometry:  THREE.Geometry          = new THREE.ConeGeometry(
      object3D.scale.x,
      object3D.scale.y,
      this.NUMBER_CORNERS_PYRAMID,
    );

    const generatedObject:  THREE.Mesh = new THREE.Mesh(pyramidGeometry, generatedColor);

    this.addColorToMap(object3D.id, object3D.color);
    this.addObjectIdToMap(object3D.id, generatedObject.id);
    this.addObjectToScene(generatedObject, object3D.position, object3D.rotation);
  }

  private createObjectColor(colorHex: string): THREE.MeshBasicMaterial {

    return new THREE.MeshPhongMaterial( {color: colorHex} );
  }

  private addObjectIdToMap(objectId: number, generatedObjectId: number): void {

    if (this.modifiedMap && this.modifiedMapIntersect) {
      this.modifiedMap.set(objectId, generatedObjectId);
      this.modifiedMapIntersect.set(generatedObjectId, objectId);
    }
  }

  private addColorToMap(objectId: number, objectColor: string): void {
    if (this.mapOriginColor) {
      this.mapOriginColor.set(objectId, objectColor);
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
