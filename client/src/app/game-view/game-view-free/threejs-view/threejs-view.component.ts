import { AfterContentInit, Component, ElementRef, Inject, Input, ViewChild } from "@angular/core";
import * as THREE from "three";
import { ThreejsViewService } from "./threejs-view.service";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";

@Component({
  selector: "app-threejs-view",
  templateUrl: "./threejs-view.component.html",
  styleUrls: ["./threejs-view.component.css"],
})
export class TheejsViewComponent implements AfterContentInit {

  private renderer: THREE.WebGLRenderer;

  @Input()
  private iSceneVariables: ISceneVariables;

  @Input()
  private neededSnapshot: boolean;

  @ViewChild("originalScene", {read: ElementRef})
  private originalScene: ElementRef;

  public constructor(@Inject(ThreejsViewService) private threejsViewService: ThreejsViewService) {}

  public ngAfterContentInit(): void {
    this.initScene();
  }

  private initScene(): void {
    this.renderer = this.threejsViewService.getRenderer();
    this.originalScene.nativeElement.appendChild(this.renderer.domElement);
    this.threejsViewService.createScene(this.iSceneVariables);
    this.threejsViewService.animate();

    this.takeSnapShot();
  }

  private takeSnapShot(): void {

    if (this.neededSnapshot) {
      console.log(this.renderer.domElement.toDataURL("image/bmp"));
    }
  }

}
