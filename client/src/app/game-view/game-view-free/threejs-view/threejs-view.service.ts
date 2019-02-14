import { Injectable } from '@angular/core';
import * as THREE from "three";

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
  public ambLight: THREE.AmbientLight;

  constructor() {
    this.scene = new THREE.Scene(); // create the scene
    // create the camera
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

  // private initiateObject(): void {

  //   const tempString: string = "sphere";
  //   let generatedObject: THREE.Mesh;

  //   switch (tempString) {
  //     case "sphere": {
  //       generatedObject = new THREE.Mesh(new THREE.SphereGeometry(1));
  //       break;
  //     }
      
  //     case "cube": {
  //       generatedObject = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1));
  //       break;
  //     }

  //     case "cone": {
  //       generatedObject = new THREE.Mesh(new THREE.ConeGeometry(1, 1));
  //       break;
  //     }

  //     case "cylinder": {
  //       generatedObject = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1));
  //       break;
  //     }

  //     case "triangularPyramid": {
  //       generatedObject = new THREE.Mesh(new THREE.)
  //       break;
  //     }

  //     default: {
  //       console.log("mauvais types");
  //       break;
  //     }
  //   }
  // }

  // private createObjectColor(): void {

  // }

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
}
