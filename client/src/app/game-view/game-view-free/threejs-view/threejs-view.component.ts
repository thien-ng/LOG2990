import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnChanges, Output, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import * as THREE from "three";
import { ISceneMessage } from "../../../../../../common/communication/iSceneMessage";
import { IModification, ISceneData, ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { Message } from "../../../../../../common/communication/message";
import { CCommon } from "../../../../../../common/constantes/cCommon";
import { CardManagerService } from "../../../card/card-manager.service";
import { Constants } from "../../../constants";
import { ChatViewService } from "../../chat-view/chat-view.service";
import { ThreejsViewService } from "./threejs-view.service";

@Component({
  selector:     "app-threejs-view",
  templateUrl:  "./threejs-view.component.html",
  styleUrls:    ["./threejs-view.component.css"],
  providers:    [ThreejsViewService],
})
export class TheejsViewComponent implements OnChanges {

  private CHEAT_KEY_CODE:         string = "t";
  private CHEAT_INTERVAL_TIME:    number = 125;

  private renderer:               THREE.WebGLRenderer;
  private scene:                  THREE.Scene;
  private cheatFlag:              boolean;
  private modifiedObjectList:     IModification[];
  private interval:               NodeJS.Timeout;
  private focusChat:              boolean;

  @Input()
  private iSceneVariables:        ISceneVariables;

  @Input()
  private iSceneVariablesMessage: ISceneData;

  @Input()
  private isSnapshotNeeded:       boolean;

  @Output()
  public sceneGenerated:          EventEmitter<string>;

  @ViewChild("originalScene", {read: ElementRef})
  private originalScene:          ElementRef;

  @HostListener("body:keyup", ["$event"])
  public async keyboardEventListener(keyboardEvent: KeyboardEvent): Promise<void> {
    if (!this.focusChat) {
      this.handleKeyboardEvent(keyboardEvent);
    }
  }

  public constructor(
    @Inject(ThreejsViewService) private threejsViewService: ThreejsViewService,
    @Inject(ChatViewService)    private chatViewService: ChatViewService,
    private httpClient:         HttpClient,
    private snackBar:           MatSnackBar,
    private cardManagerService: CardManagerService,
    ) {
    this.sceneGenerated = new EventEmitter();
    this.scene          = new THREE.Scene();
    this.cheatFlag      = true;
    this.focusChat      = false;
    this.chatViewService.getChatFocusListener().subscribe((newValue: boolean) => {
      this.focusChat = newValue;
    });
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

  private handleKeyboardEvent(keyboardEvent: KeyboardEvent): void {

    if (keyboardEvent.key === this.CHEAT_KEY_CODE) {

      this.getModifiedObjectIds();
      if (this.cheatFlag) {

        this.cheatFlag = !this.cheatFlag;
        let flashValue: boolean = true;

        this.interval = setInterval(
          () => {
            flashValue = !flashValue;
            this.threejsViewService.changeObjectsColor(this.modifiedObjectList, flashValue);
          },
          this.CHEAT_INTERVAL_TIME);
      } else {

        clearInterval(this.interval);
        this.cheatFlag = !this.cheatFlag;
        this.threejsViewService.changeObjectsColor(this.modifiedObjectList, true);
      }
    }
  }

  private getModifiedObjectIds(): void {
    this.httpClient.get(Constants.GET_OBJECTS_ID_PATH + "id").subscribe((modificationMap: IModification[]) => {
      this.modifiedObjectList = modificationMap;
    });
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
