import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, Inject, Input, OnChanges, ViewChild, Output, EventEmitter } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import * as THREE from "three";
import { ISceneMessage } from "../../../../../../common/communication/iSceneMessage";
import { ISceneVariables, ISceneVariablesMessage } from "../../../../../../common/communication/iSceneVariables";
import { Message } from "../../../../../../common/communication/message";
import { CardManagerService } from "../../../card/card-manager.service";
import { Constants } from "../../../constants";
import { ThreejsViewService } from "./threejs-view.service";

@Component({
  selector: "app-threejs-view",
  templateUrl: "./threejs-view.component.html",
  styleUrls: ["./threejs-view.component.css"],
  providers: [ThreejsViewService],
})
export class TheejsViewComponent implements OnChanges {

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;

  @Input()
  private iSceneVariables: ISceneVariables;

  @Input()
  private iSceneVariablesMessage: ISceneVariablesMessage;

  @Input()
  private isSnapshotNeeded: boolean;

  @Output()
  public sceneGenerated: EventEmitter<string>;

  @ViewChild("originalScene", {read: ElementRef})
  private originalScene: ElementRef;

  public constructor(
    @Inject(ThreejsViewService) private threejsViewService: ThreejsViewService,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private cardManagerService: CardManagerService,
    ) {
    this.sceneGenerated = new EventEmitter()
    this.scene = new THREE.Scene();
  }

  public ngOnChanges(): void {
    if (this.iSceneVariables !== undefined) {
      this.initScene();
    }
  }
  
  private initScene(): void {
    
    this.renderer = new THREE.WebGLRenderer();
    this.originalScene.nativeElement.appendChild(this.renderer.domElement);
    this.threejsViewService.createScene(this.scene, this.iSceneVariables, this.renderer);
    this.threejsViewService.animate();
    this.takeSnapShot();
  }

  private takeSnapShot(): void {

    if (this.isSnapshotNeeded) {
      const snapshot: string = this.renderer.domElement.toDataURL("image/jpeg");
      const message: ISceneMessage = this.createMessage(snapshot);
      this.sendSnapshot(message);
    }
  }

  private createMessage(image: string): ISceneMessage {
    return {
      iSceneVariablesMessage: this.iSceneVariablesMessage,
      image: image,
    } as ISceneMessage;
  }

  private sendSnapshot(message: ISceneMessage): void {
    this.httpClient.post(Constants.FREE_SUBMIT_PATH, message).subscribe((response: Message) => {
      this.analyseResponse(response);
    });
  }

  private analyseResponse(response: Message): void {

    if (response.title === Constants.ON_SUCCESS_MESSAGE) {
      this.cardManagerService.updateCards(true);
      this.sceneGenerated.emit();
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
