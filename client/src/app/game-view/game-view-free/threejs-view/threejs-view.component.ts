import { AfterContentInit, Component, ElementRef, Inject, Input, ViewChild } from "@angular/core";
import * as THREE from "three";
import { HttpClient } from "@angular/common/http";
import { ThreejsViewService } from "./threejs-view.service";
import { ISceneMessage } from "../../../../../../common/communication/iSceneMessage";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { CardManagerService } from "../../../card/card-manager.service";
import { Constants } from "../../../constants";
import { MatSnackBar } from "@angular/material";
import { Message } from "../../../../../../common/communication/message";

@Component({
  selector: "app-threejs-view",
  templateUrl: "./threejs-view.component.html",
  styleUrls: ["./threejs-view.component.css"],
})
export class TheejsViewComponent implements AfterContentInit {

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;

  @Input()
  private iSceneVariables: ISceneVariables;

  @Input()
  private neededSnapshot: boolean;

  @ViewChild("originalScene", {read: ElementRef})
  private originalScene: ElementRef;

  public constructor(
    @Inject(ThreejsViewService) private threejsViewService: ThreejsViewService,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private cardManagerService: CardManagerService,
    ) {

    this.scene = new THREE.Scene();
  }

  public ngAfterContentInit(): void {
    this.initScene();
  }

  private initScene(): void {
    this.renderer = this.threejsViewService.getRenderer();
    this.originalScene.nativeElement.appendChild(this.renderer.domElement);
    this.threejsViewService.createScene(this.scene, this.iSceneVariables);
    this.threejsViewService.animate();

    this.takeSnapShot();
  }

  private takeSnapShot(): void {

    if (this.neededSnapshot) {
      const snapshot: string = this.renderer.domElement.toDataURL("image/jpeg");
      const message: ISceneMessage = this.createMessage(snapshot);
      this.sendSnapshot(message);
    }
  }

  private sendSnapshot(message: ISceneMessage): void {
    console.log(message);
    this.httpClient.post(Constants.FREE_SUBMIT_PATH, message).subscribe((response: Message) => {
      this.analyseResponse(response);
    });
  }

  private createMessage(image: string): ISceneMessage {
    return {
      sceneVariable: this.iSceneVariables,
      image: image,
    } as ISceneMessage;
  }

  private analyseResponse(response: Message): void {

    if (response.title === Constants.ON_SUCCESS_MESSAGE) {
      this.cardManagerService.updateCards(true);
      
    } else if (response.title === Constants.ON_ERROR_MESSAGE) {
      this.openSnackBar(response.body, Constants.SNACK_ACTION);
    }
  }

  private openSnackBar(msg: string, action: string): void {
    this.snackBar.open(msg, action, {
      duration: Constants.SNACKBAR_DURATION,
      verticalPosition: "top",
    });
  }

}
