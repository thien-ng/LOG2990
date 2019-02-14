import { Injectable } from '@angular/core';
import * as THREE from "three";
import { SceneObjectType } from "../../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { ThreejsGenerator } from "./utilitaries/threejs-generator";

@Injectable({
  providedIn: 'root'
})
export class ThreejsViewService {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private light: THREE.DirectionalLight;
  private light2: THREE.DirectionalLight;
  private renderer: THREE.WebGLRenderer;
  private ambLight: THREE.AmbientLight;


  //test
  private iAxisValues = {
    x: 1,
    y: 1,
    z: 1,
  };

  private sceneVariable: ISceneVariables = {
    sceneObjectsQuantity: 1,
    sceneObjects: [
      {type: SceneObjectType.TriangularPyramid,
        position: this.iAxisValues,
        rotation: this.iAxisValues,
        color: "ea6117",
        scale: this.iAxisValues},
      {type: SceneObjectType.Cube,
        position: {
          x: 5,
          y: 5,
          z: 5,
        },
        rotation: this.iAxisValues,
        color: "ea6117",
        scale: this.iAxisValues},
    ],
    sceneBackgroundColor: "ffffff",
  };
  private threejsGenerator: ThreejsGenerator;

  constructor() {
    this.scene = new THREE.Scene();
    this.threejsGenerator = new ThreejsGenerator(this.scene);
    this.init();
  }

  private init(): void {
    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 100);
    this.renderer = new THREE.WebGLRenderer();

    this.light = new THREE.DirectionalLight(0xea6117, 0.5); // add light1
    this.light2 = new THREE.DirectionalLight(0xea6117, 0.5); // add light2
    this.ambLight = new THREE.AmbientLight(0xea6117, 0.4);
  }

  public createScene(): void {
    this.renderer.setSize(640, 480);
    this.scene.add(this.ambLight);
    this.renderer.setClearColor(this.sceneVariable.sceneBackgroundColor);
    this.createLighting();

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

    this.generateSceneObjects();

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

  private generateSceneObjects(): void {
    this.sceneVariable.sceneObjects.forEach((element) => {
      this.threejsGenerator.initiateObject(element);
    });
  }

}
