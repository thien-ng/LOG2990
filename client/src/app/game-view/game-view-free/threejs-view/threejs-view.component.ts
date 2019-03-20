import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnChanges, Output, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import * as THREE from "three";
import { ISceneMessage } from "../../../../../../common/communication/iSceneMessage";
import { ISceneData, ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
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

  public scene:                   THREE.Scene;

  private readonly CHEAT_URL:     string = "cheat/";

  private CHEAT_KEY_CODE:         string = "t";
  private CHEAT_INTERVAL_TIME:    number = 125;
  private renderer:               THREE.WebGLRenderer;
  private isCheating:             boolean;
  private interval:               NodeJS.Timeout;
  private focusChat:              boolean;

  @Input()
  private arenaID:                 number;

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
  public async keyboardEventListenerUp(keyboardEvent: KeyboardEvent): Promise<void> {
    if (!this.focusChat) {
      this.onKeyUp(keyboardEvent);
    }
  }

  @HostListener("body:keydown", ["$event"])
  public async keyboardEventListenerDown(keyboardEvent: KeyboardEvent): Promise<void> {
    if (!this.focusChat) {
      this.handleKeyboardEvent(keyboardEvent);
    }
  }

  public constructor(
    @Inject(ThreejsViewService) private threejsViewService: ThreejsViewService,
    @Inject(ChatViewService)    private chatViewService:    ChatViewService,
    private httpClient:         HttpClient,
    private snackBar:           MatSnackBar,
    private cardManagerService: CardManagerService,
    ) {
    this.sceneGenerated = new EventEmitter();
    this.scene          = new THREE.Scene();
    this.isCheating     = false;
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

  // tslint:disable-next-line:max-func-body-length
  private handleKeyboardEvent(keyboardEvent: KeyboardEvent): void {

    if (keyboardEvent.key === this.CHEAT_KEY_CODE) {
      this.httpClient.get(Constants.GET_OBJECTS_ID_PATH + this.CHEAT_URL + this.arenaID).subscribe((modifications: number[]) => {
        this.changeColor(modifications);
      });
    }

    switch ( keyboardEvent.keyCode ) {

      case 38: // up
      case 87: // w
        this.threejsViewService.setupFront(-1);
        this.threejsViewService.moveForward = true;
        console.log("DOWN: " + keyboardEvent.key);
        break;

      case 37: // left
      case 65: // a
        // this.threejsViewService.setupFront(-1);
        this.threejsViewService.moveLeft = true;
        console.log("DOWN: " + keyboardEvent.key);
        break;

      case 40: // down
      case 83: // s
        this.threejsViewService.setupFront(1);
        this.threejsViewService.moveBackward = true;
        console.log("DOWN: " + keyboardEvent.key);
        break;

      case 39: // right
      case 68: // d
        // this.threejsViewService.setupFront(-1);
        this.threejsViewService.moveRight = true;
        console.log("DOWN: " + keyboardEvent.key);
        break;

      case 32: // space
        // this.threejsViewService.setupFront(1);
        this.threejsViewService.canJump = true;
        console.log("DOWN: " + keyboardEvent.key);
        break;
      case 67: // c
        this.threejsViewService.goLow = true;
        break;

      default:
        break;
    }
  }

  // tslint:disable-next-line:max-func-body-length
  private onKeyUp(keyboardEvent: KeyboardEvent): void {
    switch ( keyboardEvent.keyCode ) {
      case 38: // up
      case 87: // w
        this.threejsViewService.moveForward = false;
        console.log("UP: " + keyboardEvent.key);
        break;
      case 37: // left
      case 65: // a
        this.threejsViewService.moveLeft = false;
        console.log("UP: " + keyboardEvent.key);
        break;
      case 40: // down
      case 83: // s
        this.threejsViewService.moveBackward = false;
        console.log("UP: " + keyboardEvent.key);
        break;
      case 39: // right
      case 68: // d
        this.threejsViewService.moveRight = false;
        console.log("UP: " + keyboardEvent.key);
        break;
      case 32: // space
        this.threejsViewService.canJump = false;
        console.log("UP: " + keyboardEvent.key);
        break;
      case 67: // c
        this.threejsViewService.goLow = false;
        break;
      default:
        break;
    }
  }

  private changeColor(modifications: number[]): void {
    this.isCheating = !this.isCheating;

    if (this.isCheating) {

      let flashValue: boolean = false;
      this.interval = setInterval(
        () => {
          flashValue = !flashValue;
          this.threejsViewService.changeObjectsColor(modifications, flashValue);
        },
        this.CHEAT_INTERVAL_TIME);
    } else {

      clearInterval(this.interval);
      this.threejsViewService.changeObjectsColor(modifications, false);
    }
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
