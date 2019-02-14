import { AfterContentInit, Component, ElementRef, Inject, ViewChild } from "@angular/core";
import * as THREE from "three";
import { ThreejsViewService } from "./threejs-view.service";

@Component({
  selector: "app-threejs-view",
  templateUrl: "./threejs-view.component.html",
  styleUrls: ["./threejs-view.component.css"],
})
export class TheejsViewComponent implements AfterContentInit {

  private renderer: THREE.WebGLRenderer;

  @ViewChild("originalScene", {read: ElementRef})
  private originalScene: ElementRef;

  public constructor(@Inject(ThreejsViewService) private threejsViewService: ThreejsViewService) {}

  public ngAfterContentInit(): void {
    this.renderer = this.threejsViewService.getRenderer();
    this.initScene();
  }

  public initScene(): void {
    this.originalScene.nativeElement.appendChild(this.renderer.domElement);
    this.threejsViewService.createScene();
    this.threejsViewService.animate();
  }

}
