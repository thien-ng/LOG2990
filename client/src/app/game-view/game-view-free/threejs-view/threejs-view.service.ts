import { Injectable } from '@angular/core';
import * as THREE from "three";

@Injectable({
  providedIn: 'root'
})
export class ThreejsViewService {

  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  // private renderer: THREE.WebGLRenderer;
  private light: THREE.DirectionalLight;
  private light2: THREE.DirectionalLight;
  private material: THREE.MeshBasicMaterial;
  private sceneObjects: THREE.Mesh[] = [];
  private sphere: THREE.Mesh;
  public ambLight: THREE.AmbientLight;

  constructor() {
    this.scene = new THREE.Scene(); // create the scene
    // create the camera
    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 100);
    // this.renderer = new THREE.WebGLRenderer();

    this.light = new THREE.DirectionalLight(0xea6117, 0.5); // add light1
    this.light2 = new THREE.DirectionalLight(0xea6117, 0.5); // add light2
    this.material = new THREE.MeshPhongMaterial({color:0xea6117});
    this.ambLight = new THREE.AmbientLight(0xea6117, 0.4);
    // create a box and add it to the scene
    for (let index: number = 0; index < 5; index++) {
      this.sceneObjects.push(new THREE.Mesh(new THREE.CubeGeometry(1,1,1), this.material));
    }
    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(1), this.material);
  }
  public createScene(): void {
    // set size
    // this.renderer.setSize(500, 500);
    // const scene3D: HTMLElement | null = document.getElementById("scene3d");
    // if (scene3D) {
    //   scene3D.appendChild(this.renderer.domElement);
    // }
    // this._scene.add(this._axis);
    this.scene.add(this.ambLight);
    this.light.position.set(100, 100, 50);
    this.light.intensity = 5;
    this.scene.add(this.light);
    this.light2.position.set(-10, 10, -10);
    this.light2.intensity = 0.5;
    this.scene.add(this.light2);
    let posDrift: number = 0.5;
    this.sceneObjects.forEach((element) => {
      this.scene.add(element);
      element.position.x = posDrift;
      element.position.y = posDrift;
      posDrift += 1;
    });
    this.scene.add(this.sphere);
    this.sphere.position.x = 0;
    this.sphere.rotation.y = 0;

    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.position.z = 0;

    this.camera.lookAt(this.scene.position);
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
}
