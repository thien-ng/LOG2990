import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnChanges, Output, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import * as THREE from "three";
import { ISceneMessage } from "../../../../../../common/communication/iSceneMessage";
import { IModificationMap, ISceneVariables, ISceneVariablesMessage } from "../../../../../../common/communication/iSceneVariables";
import { Message } from "../../../../../../common/communication/message";
import { CCommon } from "../../../../../../common/constantes/cCommon";
import { CardManagerService } from "../../../card/card-manager.service";
import { Constants } from "../../../constants";
import { ThreejsViewService } from "./threejs-view.service";

@Component({
  selector:     "app-threejs-view",
  templateUrl:  "./threejs-view.component.html",
  styleUrls:    ["./threejs-view.component.css"],
  providers:    [ThreejsViewService],
})
export class TheejsViewComponent implements OnChanges {

  private renderer:               THREE.WebGLRenderer;
  private scene:                  THREE.Scene;
  private cheatFlag:              boolean;
  private modifiedObjectList:     IModificationMap[] = [{id: 1, type: 1}, {id: 2, type: 1} , {id: 3, type: 1}, {id: 4, type: 1}];

  @Input()
  private iSceneVariables:        ISceneVariables;

  @Input()
  private iSceneVariablesMessage: ISceneVariablesMessage;

  @Input()
  private isSnapshotNeeded:       boolean;

  @Output()
  public sceneGenerated:          EventEmitter<string>;

  @ViewChild("originalScene", {read: ElementRef})
  private originalScene:          ElementRef;

  private interval: NodeJS.Timeout;

  @HostListener("body:keyup", ["$event"])
  public async handleKeyboardEvent(event: KeyboardEvent): Promise<void> {
    if (event.keyCode === 84) {
      await this.getModifiedObjectIds();
      if (this.cheatFlag) {
        this.cheatFlag = !this.cheatFlag;
        let flashValue: boolean = true;
        this.interval = setInterval(() => {
          flashValue = !flashValue;
          this.threejsViewService.changeObjectsColor(this.modifiedObjectList, flashValue);
        }, 125);
      } else {
        clearInterval(this.interval);
        this.cheatFlag = !this.cheatFlag;
        this.threejsViewService.changeObjectsColor(this.modifiedObjectList, true);
      }
    }
  }

  public constructor(
    @Inject(ThreejsViewService) private threejsViewService: ThreejsViewService,
    private httpClient:         HttpClient,
    private snackBar:           MatSnackBar,
    private cardManagerService: CardManagerService,
    ) {
    this.sceneGenerated = new EventEmitter();
    this.scene          = new THREE.Scene();
    this.cheatFlag      = true;
  }

  public ngOnChanges(): void {
    if (this.iSceneVariables !== undefined) {
      this.initScene();
    }
  }

  private getModifiedObjectIds(): void {
    this.httpClient.get(Constants.GET_OBJECTS_ID_PATH + "id").subscribe((modificationMap: IModificationMap[]) => {
      this.modifiedObjectList = modificationMap;
    });
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
      const snapshot: string        = this.renderer.domElement.toDataURL("image/jpeg");
      const message:  ISceneMessage = this.createMessage(snapshot);
      this.sendSnapshot(message);
    }
  }

  private createMessage(image: string): ISceneMessage {
    return {
      iSceneVariablesMessage:   this.iSceneVariablesMessage,
      image:                    image,
    } as ISceneMessage;
  }

  private sendSnapshot(message: ISceneMessage): void {
    this.httpClient.post(Constants.FREE_SUBMIT_PATH, message).subscribe((response: Message) => {
      this.analyseResponse(response);
    });
  }

  private analyseResponse(response: Message): void {

    if (response.title === CCommon.ON_SUCCESS) {
      this.cardManagerService.updateCards(true);
      this.sceneGenerated.emit();
    } else if (response.title === CCommon.ON_ERROR) {
      this.openSnackBar(response.body, Constants.SNACK_ACTION);
    }
  }

  private openSnackBar(msg: string, action: string): void {
    this.snackBar.open(msg, action, {
      duration:           Constants.SNACKBAR_DURATION,
      verticalPosition:   "top",
    });
  }

}
