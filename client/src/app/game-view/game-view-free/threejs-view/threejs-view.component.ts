import { HttpClient } from "@angular/common/http";
import {
  AfterContentInit, Component, ElementRef, EventEmitter, HostListener,
  Inject, Input, OnChanges, OnDestroy, Output, ViewChild} from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { GameConnectionService } from "src/app/game-connection.service";
import * as THREE from "three";
import { ActionType, ICheat, IClickMessage, IPosition2D, ISceneObjectUpdate } from "../../../../../../common/communication/iGameplay";
import { ISceneMessage } from "../../../../../../common/communication/iSceneMessage";
import { IMesh, ISceneObject } from "../../../../../../common/communication/iSceneObject";
import { SceneType } from "../../../../../../common/communication/iSceneOptions";
import { IMeshInfo, ISceneData, ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { Message } from "../../../../../../common/communication/message";
import { CCommon } from "../../../../../../common/constantes/cCommon";
import { CClient } from "../../../CClient";
import { CardManagerService } from "../../../card/card-manager.service";
import { SocketService } from "../../../websocket/socket.service";
import { ChatViewService } from "../../chat-view/chat-view.service";
import { GameViewFreeService } from "../game-view-free.service";
import { ThreejsThemeViewService } from "./threejs-ThemeView.service";
import { ThreejsViewService } from "./threejs-view.service";

@Component({
  selector:     "app-threejs-view",
  templateUrl:  "./threejs-view.component.html",
  styleUrls:    ["./threejs-view.component.css"],
  providers:    [ThreejsViewService, ThreejsThemeViewService],
})
export class TheejsViewComponent implements AfterContentInit, OnChanges, OnDestroy {

  private readonly CHEAT_URL:           string = "cheat/";
  private readonly CHEAT_KEYBOARD_KEY:  string = "t";
  private readonly CHEAT_INTERVAL_TIME: number = 125;

  private renderer:               THREE.WebGLRenderer;
  private scene:                  THREE.Scene;
  private interval:               NodeJS.Timeout;
  private isCheating:             boolean;
  private focusChat:              boolean;
  private isFirstGet:             boolean;
  private modifications:          number[];
  private previousModifications:  number[];
  private sceneBuilderService:    ThreejsThemeViewService | ThreejsViewService; // _TODO: renommer mieux

  @Input() private iSceneVariables:         ISceneVariables<ISceneObject | IMesh>;
  @Input() private meshInfos:               IMeshInfo[];
  @Input() private sceneData:               ISceneData<ISceneObject | IMesh>;
  @Input() private rightClick:              boolean;
  @Input() private isSnapshotNeeded:        boolean;
  @Input() private isNotOriginal:           boolean;
  @Input() private username:                string;
  @Input() private arenaID:                 number;
  @Output() public sceneGenerated:          EventEmitter<string>;
  @Output() public isCheater:               EventEmitter<boolean>;

  @ViewChild("originalScene", {read: ElementRef})
  private originalScene:          ElementRef;

  @HostListener("body:keyup", ["$event"])
  public async keyboardEventListenerUp(keyboardEvent: KeyboardEvent): Promise<void> {
    if (!this.focusChat) {
      this.sceneBuilderService.onKeyMovement(keyboardEvent, false);
    }
  }

  @HostListener("body:keydown", ["$event"])
  public async keyboardEventListenerDown(keyboardEvent: KeyboardEvent): Promise<void> {
    if (!this.focusChat) {
      this.onKeyDown(keyboardEvent);
      this.sceneBuilderService.onKeyMovement(keyboardEvent, true);
    }
  }

  public constructor(
    @Inject(ThreejsViewService)         private threejsViewService:       ThreejsViewService,
    @Inject(ThreejsThemeViewService)    private threejsThemeViewService:  ThreejsThemeViewService,
    @Inject(ChatViewService)            private chatViewService:          ChatViewService,
    @Inject(SocketService)              private socketService:            SocketService,
    @Inject(GameViewFreeService)        private gameViewFreeService:      GameViewFreeService,
    private httpClient:             HttpClient,
    private snackBar:               MatSnackBar,
    private cardManagerService:     CardManagerService,
    private gameConnectionService:  GameConnectionService,
    ) {
    this.rightClick     = false;
    this.isCheating     = false;
    this.focusChat      = false;
    this.isFirstGet     = true;
    this.sceneGenerated = new EventEmitter();
    this.isCheater      = new EventEmitter();
    this.scene          = new THREE.Scene();
    this.initSubscriptions();
  }

  public onMouseMove(point: IPosition2D): void {
    if (this.rightClick) {
      this.sceneBuilderService.rotateCamera(point);
    }
  }

  public ngAfterContentInit(): void {
    this.initListener();
  }

  public ngOnChanges(): void {
    if (this.iSceneVariables !== undefined) {
      this.initScene();
    }
  }

  private initScene(): void {
    this.renderer = new THREE.WebGLRenderer();
    this.originalScene.nativeElement.appendChild(this.renderer.domElement);
    this.createScene().then(() => {
      this.sceneBuilderService.animate();
      this.takeSnapShot();
    }).catch((error: Error) => this.openSnackBar(error.message, CClient.SNACK_ACTION));
  }

  private async createScene(): Promise<void> {
    this.sceneBuilderService =
      (this.iSceneVariables.theme === SceneType.Geometric) ? this.threejsViewService : this.threejsThemeViewService;

    const meshUsed: IMeshInfo[] | undefined = (this.isSnapshotNeeded) ? this.sceneData.meshInfos : this.meshInfos;

    if (this.sceneBuilderService instanceof ThreejsThemeViewService) {
      await this.sceneBuilderService.createScene(
        this.scene,
        this.iSceneVariables,
        this.renderer,
        this.isSnapshotNeeded,
        this.arenaID,
        meshUsed as IMeshInfo[]).catch((error: Error) => this.openSnackBar(error.message, CClient.SNACK_ACTION));
    } else {
      this.sceneBuilderService.createScene(
        this.scene,
        this.iSceneVariables,
        this.renderer,
        this.isSnapshotNeeded,
        this.arenaID);
    }
  }

  private onKeyDown(keyboardEvent: KeyboardEvent): void {
    if (keyboardEvent.key === this.CHEAT_KEYBOARD_KEY) {
      this.cheatRoutine();
    }
  }

  private cheatRoutine (): void {
    this.httpClient.get(CClient.GET_OBJECTS_ID_PATH + this.CHEAT_URL + this.arenaID).subscribe((modifications: ICheat[]) => {
      const idsToFlash: number[] = this.sortIdToFlash(modifications);

      if (this.isFirstGet) {
        this.previousModifications = idsToFlash;
        this.isFirstGet            = false;
      }
      this.modifications = idsToFlash;
      this.isCheating    = !this.isCheating;
      this.isCheater.emit(this.isCheating);
      this.changeColor();
    });
  }

  private changeColor(): void {

    if (this.isCheating) {

      let flashValue: boolean = false;
      this.interval = setInterval(
        () => {
          flashValue = !flashValue;
          this.sceneBuilderService.changeObjectsColor(flashValue, false, this.modifications);
        },
        this.CHEAT_INTERVAL_TIME);
    } else {

      clearInterval(this.interval);
      this.sceneBuilderService.changeObjectsColor(false, true, this.previousModifications);
      this.previousModifications = this.modifications;
      this.modifications         = [];
    }
  }

  private getDifferencesList(): void {
    this.socketService.sendMessage(CCommon.ON_GET_MODIF_LIST, this.arenaID);
    this.socketService.onMessage(CCommon.ON_RECEIVE_MODIF_LIST).subscribe((modifications: ICheat[]) => {
      this.modifications = this.sortIdToFlash(modifications);
    });
  }

  private sortIdToFlash(modifications: ICheat[]): number[] {
    const idsToFlash: number[] = [];
    modifications.forEach((cheatId: ICheat) => {
      if (this.isNotOriginal) {
        if (cheatId.action === ActionType.DELETE || cheatId.action === ActionType.CHANGE_COLOR) {
          idsToFlash.push(cheatId.id);
        }
      } else {
        if (cheatId.action === ActionType.ADD || cheatId.action === ActionType.CHANGE_COLOR) {
          idsToFlash.push(cheatId.id);
        }
      }
    });

    return idsToFlash;
  }

  private initSubscriptions(): void {
    this.gameViewFreeService.getRightClickListener().subscribe((newValue: boolean) => {
      this.rightClick = newValue;
    });

    this.chatViewService.getChatFocusListener().subscribe((newValue: boolean) => {
      this.focusChat = newValue;
    });

    this.gameConnectionService.getObjectToUpdate().subscribe((object: ISceneObjectUpdate<ISceneObject | IMesh>) => {
      this.getDifferencesList();

      this.sceneBuilderService.changeObjectsColor(false, true, this.modifications);
      if (this.isNotOriginal) {
        try {
          this.sceneBuilderService.updateSceneWithNewObject(object as ISceneObjectUpdate<ISceneObject | IMesh>);
        } catch (error) {
          this.socketService.sendMessage(CCommon.ERROR_HANDLING, error.msg);
        }
      }
    });
  }

  private initListener(): void {
    this.originalScene.nativeElement.addEventListener("click", (mouseEvent: MouseEvent) => {

      const idValue: number                  = this.sceneBuilderService.detectObject(mouseEvent);
      const message: IClickMessage<number>   = this.createHitValidationMessage(idValue);

      this.socketService.sendMessage(CCommon.POSITION_VALIDATION, message);
    });
  }

  private takeSnapShot(): void {
    if (this.isSnapshotNeeded) {
      const snapshot: string        = this.renderer.domElement.toDataURL("image/jpeg");
      const message:  ISceneMessage = this.createMessage(snapshot);
      this.sendSnapshot(message);
    }
  }

  private createHitValidationMessage(id: number): IClickMessage<number> {
    return {
      value:    id,
      arenaID:  this.arenaID,
      username: this.username,
    };
  }

  private createMessage(image: string): ISceneMessage {
    return {
      sceneData:   this.sceneData,
      image:       image,
    } as ISceneMessage;
  }

  private sendSnapshot(message: ISceneMessage): void {
    this.httpClient.post(CClient.FREE_SUBMIT_PATH, message).subscribe((response: Message) => {
      this.analyseResponse(response);
    });
  }

  private analyseResponse(response: Message): void {

    if (response.title === CCommon.ON_SUCCESS) {
      this.cardManagerService.updateCards(true);
      this.sceneGenerated.emit();
    } else if (response.title === CCommon.ON_ERROR) {
      this.openSnackBar(response.body, CClient.SNACK_ACTION);
    }
  }

  private openSnackBar(msg: string, action: string): void {
    this.snackBar.open(msg, action, {
      duration:           CClient.SNACKBAR_DURATION,
      verticalPosition:   "top",
    });
  }

  public ngOnDestroy(): void {
    if (this.renderer) {
      this.renderer.dispose();
    }
    (this.iSceneVariables && this.iSceneVariables.floorObject) ?
    cancelAnimationFrame(this.threejsThemeViewService.handleId) : cancelAnimationFrame(this.threejsViewService.handleId);
  }

}
