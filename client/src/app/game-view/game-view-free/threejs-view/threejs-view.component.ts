import { Component } from '@angular/core';
import * as THREE from "three";

@Component({
  selector: 'app-threejs-view',
  templateUrl: './threejs-view.component.html',
  styleUrls: ['./threejs-view.component.css']
})
export class TheejsViewComponent {
  private _scene: THREE.Scene;
  // private _canvas: HTMLCanvasElement;
  private _camera: THREE.PerspectiveCamera;
  private _renderer: THREE.WebGLRenderer;
  // private _axis: THREE.AxisHelper;
  private _light: THREE.DirectionalLight;
  private _light2: THREE.DirectionalLight;
  private _material: THREE.MeshBasicMaterial;
  private sceneObjects: THREE.Mesh[] = [];
  private sphere: THREE.Mesh;
  // private hidden: boolean = false;
  // private isCreated: boolean = false;
  public ambLight: THREE.AmbientLight;

  public constructor() {
    // this._canvas = <HTMLCanvasElement>document.getElementById(canvasElement);
    this._scene = new THREE.Scene(); // create the scene
    // create the camera
    this._camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 100);
    this._renderer = new THREE.WebGLRenderer();
    // this._axis = new THREE.AxisHelper(10); // add axis to the scene
    this._light = new THREE.DirectionalLight(0xea6117, 0.5); // add light1
    this._light2 = new THREE.DirectionalLight(0xea6117, 0.5); // add light2
    this._material = new THREE.MeshPhongMaterial({color:0xea6117});
    this.ambLight = new THREE.AmbientLight(0xea6117, 0.4);
    // create a box and add it to the scene
    for (let index: number = 0; index < 5; index++) {
      this.sceneObjects.push(new THREE.Mesh(new THREE.CubeGeometry(1,1,1), this._material));
    }
    this.sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5), this._material);
  }

  public createScene(): void {
    // set size
    this._renderer.setSize(500, 500);
    // document.body.appendChild(this._renderer.domElement); // add canvas to dom
    const scene3D: HTMLElement | null = document.getElementById("scene3d");
    if (scene3D) {
      scene3D.appendChild(this._renderer.domElement);
    }
    // this._scene.add(this._axis);
    this._scene.add(this.ambLight);
    this._light.position.set(100, 100, 50);
    this._light.intensity = 5;
    this._scene.add(this._light);
    this._light2.position.set(-10, 10, -10);
    this._light2.intensity = 0.5;
    this._scene.add(this._light2);
    let posDrift: number = 0.5;
    this.sceneObjects.forEach((element) => {
      this._scene.add(element);
      element.position.x = posDrift;
      element.position.y = posDrift;
      posDrift += 1;
    });
    this._scene.add(this.sphere);
    this.sphere.position.x = 0;
    this.sphere.rotation.y = 0;

    this._camera.position.x = 0;
    this._camera.position.y = 0;
    this._camera.position.z = -10;

    this._camera.lookAt(this._scene.position);
}
public angle: number = 100;
public radius: number = 10;
public animate(): void {
  requestAnimationFrame(this.animate.bind(this));
  this._camera.position.x = this.radius * Math.cos( this.angle ) - 0;  
  this._camera.position.z = this.radius * Math.sin( this.angle ) - 20;
  this.angle += 0.01;
  this._render();
}

private _render(): void {
  const timer = Date.now() * 0.0025;
  // this._box.position.y = 0.15*( 13*Math.cos(timer) - 5*Math.cos(2*timer) - 4*Math.cos(4*timer));
  // this._box.position.x = 0.15*( 16*Math.pow(Math.sin(timer), 3));
  let multDrift: number = 0.1;
  this.sceneObjects.forEach(element => {
    // element.position.x = multDrift*( 16*Math.pow(Math.sin(timer), 3));
    // element.position.y = multDrift*( 13*Math.cos(timer) - 5*Math.cos(2*timer) - 4*Math.cos(4*timer));
    // multDrift += 0.025;
  });
  this._renderer.render(this._scene, this._camera);
}

// public loadScene(): void {
//   if (!this.isCreated) {
//     const loginSceneComponent: LoginSceneComponent = new LoginSceneComponent();
//     loginSceneComponent.createScene();
//     loginSceneComponent.animate();
//     this.isCreated = true;
//   }
// }

  // public changeLogoVisibility(): void {
  // this.hidden = this.hidden ? false : true;
  //   if (this.hidden) {
  //     this.loadScene();
  //   } else {
  //     this._renderer.dispose();
  //     this._material.dispose();
  //   }
  // }


}

window.onload = () => {
  const theejsViewComponent: TheejsViewComponent = new TheejsViewComponent();
  theejsViewComponent.createScene();
  theejsViewComponent.animate();
};
