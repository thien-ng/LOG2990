import { HttpClient } from "@angular/common/http";
import { AfterContentInit, Component, ElementRef, Inject, Input, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import * as THREE from "three";
import { IGameRequest } from "../../../../../../common/communication/iGameRequest";
import { ISceneMessage } from "../../../../../../common/communication/iSceneMessage";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { Message } from "../../../../../../common/communication/message";
import { CardManagerService } from "../../../card/card-manager.service";
import { Constants } from "../../../constants";
import { ThreejsViewService } from "./threejs-view.service";

const SUCCESS_STATUS: number = 200;

@Component({
  selector: "app-threejs-view",
  templateUrl: "./threejs-view.component.html",
  styleUrls: ["./threejs-view.component.css"],
})
export class TheejsViewComponent implements AfterContentInit {

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;

  @Input()
  private gameRequest: IGameRequest;

  @Input()
  private iSceneVariables: ISceneVariables;

  @Input()
  private isSnapshotNeeded: boolean;

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
    if (!this.isSnapshotNeeded) {
      this.httpClient.post(Constants.GAME_REQUEST_PATH, this.gameRequest).subscribe((data: Message) => {
        fetch(data.body).then((response) => {
          this.loadFileInObject(response)
          .then(() => {
            this.initScene();
          })
          .catch((error) => {
            this.openSnackBar(error, Constants.SNACK_ACTION);
          });
        })
        .catch((error) => {
          this.openSnackBar(error, Constants.SNACK_ACTION);
        });
      });
    } else {
      this.initScene();
    }
  }

  private async loadFileInObject(response: Response): Promise<void> {
    if (response.status !== SUCCESS_STATUS) {
      this.openSnackBar(response.statusText, Constants.SNACK_ACTION);
    } else {
      await response.json().then((variables: ISceneVariables) => {
        this.iSceneVariables = {
          gameName: variables.gameName,
          sceneBackgroundColor: variables.sceneBackgroundColor,
          sceneObjects: variables.sceneObjects,
          sceneObjectsQuantity: variables.sceneObjectsQuantity,
        };
      }).catch((error) => {
        this.openSnackBar(error, Constants.SNACK_ACTION);
      });
    }
  }

  private initScene(): void {

    this.renderer = this.threejsViewService.getRenderer();
    this.originalScene.nativeElement.appendChild(this.renderer.domElement);
    this.threejsViewService.createScene(this.scene, this.iSceneVariables);
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
      sceneVariable: this.iSceneVariables,
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
