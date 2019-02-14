import { Injectable } from '@angular/core';
import * as THREE from "three";
import { IAxisValues, ISceneObject, SceneObjectType} from "../../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";

@Injectable({
  providedIn: 'root'
})
export class ThreejsViewService {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private light: THREE.DirectionalLight;
  private light2: THREE.DirectionalLight;
  private material: THREE.MeshBasicMaterial;
  private renderer: THREE.WebGLRenderer;
  private ambLight: THREE.AmbientLight;

  private sceneVariable: ISceneVariables;

  constructor() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer();

    this.light = new THREE.DirectionalLight(0xea6117, 0.5); // add light1
    this.light2 = new THREE.DirectionalLight(0xea6117, 0.5); // add light2
    this.material = new THREE.MeshPhongMaterial({color:0xea6117});
    this.ambLight = new THREE.AmbientLight(0xea6117, 0.4);
  }
  public createScene(): void {
    this.renderer.setSize(640, 480);
    this.scene.add(this.ambLight);
    this.createLighting();

    //to remove
    const cube: THREE.Mesh = new THREE.Mesh(new THREE.CubeGeometry(3,3,3), this.material);
    cube.rotation.x = Math.PI / 3;
    this.scene.add(cube);

    this.camera.lookAt(this.scene.position);
  }

  private createLighting(): void {
    this.light.position.set(100, 100, 50);
    this.light.intensity = 5;
    this.scene.add(this.light);
    this.light2.position.set(-10, 10, -10);
    this.light2.intensity = 0.5;
    this.scene.add(this.light2);
  }
    // to remove
  public angle: number = 100;
  public radius: number = 10;
  public animate(): void {
    requestAnimationFrame(this.animate.bind(this));
    this.camera.position.x = this.radius * Math.cos( this.angle );  
    this.camera.position.z = this.radius * Math.sin( this.angle );
    this.angle += 0.01;

    this.camera.lookAt(this.scene.position);
    this.renderObject();
  }

  private renderObject(): void {
    this.renderer.render(this.scene, this.camera);
  }

  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  public updateSceneVariable(sceneVariable: ISceneVariables): void {
    this.sceneVariable = sceneVariable;
  }

  // private initiateObject(object3D: ISceneObject): void {

  //   switch (object3D.type) {
  //     case SceneObjectType.Sphere: {
  //       this.generateSphere(object3D);
  //       break;
  //     }
      
  //     case SceneObjectType.Cube: {
  //       this.generateCube(object3D);
  //       break;
  //     }

  //     case SceneObjectType.Cone: {
  //       this.generateCone(object3D);
  //       break;
  //     }

  //     case SceneObjectType.Cylinder: {
  //       this.generateCylinder(object3D);
  //       break;
  //     }

  //     case SceneObjectType.TriangularPyramid: {
  //       this.generateTriangularPyramid(object3D);
  //       break;
  //     }

  //     default: {
  //       break;
  //     }
  //   }

  // }

  // private generateSphere(object3D: ISceneObject): void {

  //   const generatedColor: THREE.MeshBasicMaterial = this.createObjectColor(object3D.color);
  //   const sphereGeometry: THREE.Geometry = new THREE.SphereGeometry(object3D.scale.x);
  //   const generatedObject: THREE.Mesh = new THREE.Mesh(sphereGeometry, generatedColor);

  //   this.addObjectToScene(generatedObject, object3D.position, object3D.rotation);
  // }

  // private generateCube(object3D: ISceneObject): void {

  //   const generatedColor: THREE.MeshBasicMaterial = this.createObjectColor(object3D.color);
  //   const sphereGeometry: THREE.Geometry = new THREE.CubeGeometry(
  //                                                             object3D.scale.x,
  //                                                             object3D.scale.z,
  //                                                             object3D.scale.y);
  //   const generatedObject: THREE.Mesh = new THREE.Mesh(sphereGeometry, generatedColor);

  //   this.addObjectToScene(generatedObject, object3D.position, object3D.rotation);
  // }

  // private generateCone(object3D: ISceneObject): void {

  //   const generatedColor: THREE.MeshBasicMaterial = this.createObjectColor(object3D.color);
  //   const sphereGeometry: THREE.Geometry = new THREE.ConeGeometry(
  //                                                             object3D.scale.x,
  //                                                             object3D.scale.z);
  //   const generatedObject: THREE.Mesh = new THREE.Mesh(sphereGeometry, generatedColor);

  //   this.addObjectToScene(generatedObject, object3D.position, object3D.rotation);
  // }

  // private generateCylinder(object3D: ISceneObject): void {

  //   const generatedColor: THREE.MeshBasicMaterial = this.createObjectColor(object3D.color);
  //   const sphereGeometry: THREE.Geometry = new THREE.CylinderGeometry(
  //                                                             object3D.scale.x,
  //                                                             object3D.scale.x,
  //                                                             object3D.scale.y);
  //   const generatedObject: THREE.Mesh = new THREE.Mesh(sphereGeometry, generatedColor);

  //   this.addObjectToScene(generatedObject, object3D.position, object3D.rotation);
  // }

  // private generateTriangularPyramid(object3D: ISceneObject): void {

  //   const generatedColor: THREE.MeshBasicMaterial = this.createObjectColor(object3D.color);
  //   const sphereGeometry: THREE.Geometry = new THREE.ConeGeometry(
  //                                                             object3D.scale.x,
  //                                                             object3D.scale.z,
  //                                                             3);
  //   const generatedObject: THREE.Mesh = new THREE.Mesh(sphereGeometry, generatedColor);

  //   this.addObjectToScene(generatedObject, object3D.position, object3D.rotation);
  // }

  // private createObjectColor(colorHex: string): THREE.MeshBasicMaterial {
  //   return new THREE.MeshPhongMaterial({color: colorHex});;
  // }

  // private addObjectToScene(object3D: THREE.Mesh, position: IAxisValues, orientation: IAxisValues): void {

  //   this.setObjectPosition(object3D, position);
  //   this.setObjectRotation(object3D, orientation);
  //   this.scene.add(object3D);
  // }

  // private setObjectPosition(object3D: THREE.Mesh, position: IAxisValues): void {

  //   object3D.position.x = position.x;
  //   object3D.position.y = position.y;
  //   object3D.position.z = position.z;
  // }

  // private setObjectRotation(object3D: THREE.Mesh, orientation: IAxisValues) {

  //   object3D.rotation.x = orientation.x;
  //   object3D.rotation.y = orientation.y;
  //   object3D.rotation.z = orientation.z;
  // }

}
