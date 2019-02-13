import { Component, AfterContentInit } from '@angular/core';
import * as THREE from "three";
import { ThreejsViewService } from "./threejs-view.service";

@Component({
  selector: 'app-threejs-view',
  templateUrl: './threejs-view.component.html',
  styleUrls: ['./threejs-view.component.css']
})
export class TheejsViewComponent implements AfterContentInit{

  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private threejsViewService: ThreejsViewService;

  public constructor() {
    this.threejsViewService = new ThreejsViewService();
    this.renderer = new THREE.WebGLRenderer();
    this.scene = this.threejsViewService.getScene();
    this.camera = this.threejsViewService.getCamera();
  }

  public ngAfterContentInit(): void {
    this.initScene();
  }

  public initScene(): void {
    console.log("init");
    this.generateScene();
    this.threejsViewService.createScene();
    this.animate();
  }

  private generateScene(): void {
    this.renderer.setSize(500, 500);
    const scene3D: HTMLElement | null = document.getElementById("scene3d");
    if (scene3D) {
      scene3D.appendChild(this.renderer.domElement);
    }
  }

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

}
