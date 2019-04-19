import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialogConfig, MatSnackBar } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { CClient } from "src/app/CClient";
import { GameConnectionService } from "src/app/game-connection.service";
import { SocketService } from "src/app/websocket/socket.service";
import { Mode } from "../../../../../common/communication/highscore";
import { GameMode, ICard } from "../../../../../common/communication/iCard";
import { IGameRequest } from "../../../../../common/communication/iGameRequest";
import { INewGameInfo, IPenalty, IPosition2D } from "../../../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../../../common/communication/iSceneObject";
import { IMeshInfo, ISceneData, ISceneVariables } from "../../../../../common/communication/iSceneVariables";
import { Message } from "../../../../../common/communication/message";
import { CCommon } from "../../../../../common/constantes/cCommon";
import { ChatViewComponent } from "../chat-view/chat-view.component";
import { EndGameDialogService } from "../endGameDialog/end-game-dialog.service";
import { GameViewFreeService } from "./game-view-free.service";
import { TheejsViewComponent } from "./threejs-view/threejs-view.component";

const GAMEMODE_KEY: string = "gamemode";
const RIGHT_CLICK:  number = 2;
const TEMP_FOLDER:  string  = "/temp/";
@Component({
  selector:     "app-game-view-free",
  templateUrl:  "./game-view-free.component.html",
  styleUrls:    ["./game-view-free.component.css"],
  providers:    [EndGameDialogService, {provide: MatDialogConfig, useValue: {}}],
})
export class GameViewFreeComponent implements OnInit, OnDestroy {

  @ViewChild("original")      private original:    TheejsViewComponent;
  @ViewChild("modified")      private modified:    TheejsViewComponent;
  @ViewChild("chat")          private chat:        ChatViewComponent;
  @ViewChild("opponentSound", {read: ElementRef})  public opponentSound:   ElementRef;
  @ViewChild("gameWon",       {read: ElementRef})  public gameWon:         ElementRef;
  @ViewChild("gameLost",      {read: ElementRef})  public gameLost:        ElementRef;
  @ViewChild("music",         {read: ElementRef})  public music:           ElementRef;
  @ViewChild("successSound",  {read: ElementRef})  public successSound:    ElementRef;
  @ViewChild("failSound",     {read: ElementRef})  public failSound:       ElementRef;
  @ViewChild("erreurText",    {read: ElementRef})  public erreurText:      ElementRef;
  @ViewChild("erreurText2",   {read: ElementRef})  public erreurText2:     ElementRef;

  public readonly NEEDED_SNAPSHOT:  boolean = false;
  public readonly SUCCESS_SOUND:    string  = CCommon.BASE_URL  + CCommon.BASE_SERVER_PORT + "/audio/fail.wav";
  public readonly FAIL_SOUND:       string  = CCommon.BASE_URL  + CCommon.BASE_SERVER_PORT + "/audio/success.wav";
  public readonly OPPONENT_SOUND:   string  = CCommon.BASE_URL  + CCommon.BASE_SERVER_PORT + "/audio/opponent_point.mp3";
  public readonly GAME_WON:         string  = CCommon.BASE_URL  + CCommon.BASE_SERVER_PORT + "/audio/game-won.wav";
  public readonly GAME_LOST:        string  = CCommon.BASE_URL  + CCommon.BASE_SERVER_PORT + "/audio/game-lost.wav";
  public readonly MUSIC:            string  = CCommon.BASE_URL  + CCommon.BASE_SERVER_PORT + "/audio/musicCreepy.mp3";
  public readonly CHEATER_TEXT:     string  = "Tricheur !";

  private scenePath:         string;
  private gameMode:          Mode;
  private subscription:      Subscription[];
  public  originalVariables: ISceneVariables<ISceneObject | IMesh>;
  public  modifiedVariables: ISceneVariables<ISceneObject | IMesh>;
  public  meshInfos:         IMeshInfo[];
  public  activeCard:        ICard;
  public  gameRequest:       IGameRequest;
  public  objectToUpdate:    ISceneObject[];
  public  isLoading:         boolean;
  public  rightClick:        boolean;
  public  gameIsStarted:     boolean;
  public  cardIsLoaded:      boolean;
  public  isGameEnded:       boolean;
  public  arenaID:           number;
  public  mode:              Mode;
  public  gameID:            number;
  public  username:          string | null;
  public  opponentName:      string;
  public isCheater:          boolean;

  @HostListener("mousedown", ["$event"])
  public onMouseDown(mouseEvent: MouseEvent): void {
    if (mouseEvent.button === RIGHT_CLICK) {
      this.gameViewService.updateRightClick(true);
    }
  }
  @HostListener("mouseup", ["$event"])
  public onMouseUp(mouseEvent: MouseEvent): void {
    if (mouseEvent.button === RIGHT_CLICK) {
      this.gameViewService.updateRightClick(false);
    }
  }
  @HostListener("mousemove", ["$event"])
  public onMouseMove(mouseEvent: MouseEvent): void {
    if (this.rightClick) {
      const point: IPosition2D = {
        x: mouseEvent.movementX,
        y: mouseEvent.movementY,
      };
      this.original.onMouseMove(point);
      this.modified.onMouseMove(point);
    }
  }

  public constructor(
    @Inject(GameViewFreeService)    private gameViewService:      GameViewFreeService,
    @Inject(SocketService)          private socketService:        SocketService,
    @Inject(EndGameDialogService)   private endGameDialogService: EndGameDialogService,
    private gameConnectionService:  GameConnectionService,
    private httpClient:             HttpClient,
    private route:                  ActivatedRoute,
    private snackBar:               MatSnackBar,
    ) {
      document.oncontextmenu = () => {
        return false;
      };
      this.setCheaterState(false);
      this.rightClick     = true;
      this.cardIsLoaded   = false;
      this.isLoading      = true;
      this.isGameEnded    = false;
      this.mode           = Number(this.route.snapshot.paramMap.get(GAMEMODE_KEY));
      this.username       = sessionStorage.getItem(CClient.USERNAME_KEY);
      this.subscription   = [];
      this.gameConnectionService.getGameConnectedListener().pipe(first()).subscribe((arenaID: number) => {
        this.arenaID = arenaID;
        this.socketService.sendMessage(CCommon.GAME_CONNECTION, arenaID);
        this.fetchSceneFromServer(this.scenePath)
        .catch((error) => {
          this.openSnackBar(error, CClient.SNACK_ACTION);
        });
      });
    }

  public ngOnInit(): void {
    this.gameID = Number(this.route.snapshot.paramMap.get("id"));
    const username: string | null = sessionStorage.getItem(CClient.USERNAME_KEY);
    if (this.gameID && username) {
      this.createGameRequest(this.gameID, username);
    }
    this.initEventSubscription();
  }

  public ngOnDestroy(): void {
    this.socketService.sendMessage(CCommon.GAME_DISCONNECT, this.username);
    this.subscription.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  private initEventSubscription(): void {
    this.subscription.push(this.socketService.onMessage(CCommon.ON_GAME_STARTED).subscribe(() => {
      this.chat.chatViewService.clearConversations();
      this.isLoading = false;
      this.gameViewService.playMusic();
    }));
    this.subscription.push(this.socketService.onMessage(CCommon.ON_PENALTY).subscribe((arenaResponse: IPenalty) => {
      (arenaResponse.isOnPenalty) ? this.wrongClickRoutine() : this.enableClickRoutine();
    }));
    this.subscription.push(this.socketService.onMessage(CCommon.ON_GAME_ENDED).subscribe((message: string) => {
      this.isGameEnded = true;
      const isWinner: boolean = message === CCommon.ON_GAME_WON;
      isWinner ? this.gameViewService.playWinSound() : this.gameViewService.playLossSound();
      this.gameViewService.stopMusic();
      const newGameInfo: INewGameInfo = {
        path: CClient.GAME_VIEW_FREE_PATH,
        gameID: Number(this.gameID),
        type: this.mode,
      };
      this.endGameDialogService.openDialog(isWinner, newGameInfo, GameMode.free);
    }));
    this.subscription.push(this.socketService.onMessage(CCommon.ON_COUNTDOWN_START).subscribe((message: string[]) => {
      const index: number = message[0] === this.username ? 1 : 0;
      this.opponentName = message[index];
    }));
  }

  public wrongClickRoutine(): void {
    this.gameViewService.playFailSound();
    this.disableClickRoutine();
  }

  public enableClickRoutine(): void {
    document.body.style.cursor                  = "auto";
    this.erreurText.nativeElement.textContent   = null;
    this.erreurText2.nativeElement.textContent  = null;
  }

  private disableClickRoutine(): void {
      document.body.style.cursor  = "not-allowed";
      const positionTop:   number = this.gameViewService.position.y - CClient.CENTERY;
      const positionRight: number = this.gameViewService.position.x - CClient.CENTERX;
      this.erreurText.nativeElement.style.top     = positionTop   + "px";
      this.erreurText.nativeElement.style.left    = positionRight + "px";
      this.erreurText.nativeElement.textContent   = CClient.ERROR_MESSAGE;
      this.erreurText2.nativeElement.style.top    = positionTop   + "px";
      this.erreurText2.nativeElement.style.left   = positionRight + "px";
      this.erreurText2.nativeElement.textContent  = CClient.ERROR_MESSAGE;
  }

  private createGameRequest(gameID: number, username: string): void {
    this.httpClient.get(CClient.PATH_TO_GET_CARD + gameID + "/" + GameMode.free).subscribe((response: ICard) => {
      this.activeCard = response;
      this.scenePath  = CCommon.BASE_URL + CCommon.BASE_SERVER_PORT + TEMP_FOLDER + this.activeCard.gameID + CCommon.SCENE_FILE;
      this.canvasRoutine();
      const type: string | null = this.route.snapshot.paramMap.get(GAMEMODE_KEY);
      if (type !== null) {
        this.getSceneVariables(type, username);
      }
      this.cardIsLoaded = true;
    });
  }

  private getSceneVariables(type: string, username: string): void {
    this.gameMode     = JSON.parse(type);
    this.gameRequest  = {
        username:     username,
        gameId:       this.activeCard.gameID,
        type:         this.gameMode,
        mode:         GameMode.free,
    };
    this.handleGameRequest();
  }

  private handleGameRequest(): void {
    this.httpClient.post(CClient.GAME_REQUEST_PATH, this.gameRequest).subscribe((data: Message) => {
      switch (data.title) {
        case CCommon.ON_SUCCESS:
          this.arenaID = Number(data.body);
          this.socketService.sendMessage(CCommon.GAME_CONNECTION, this.arenaID);
          this.fetchSceneFromServer(this.scenePath).catch((error) => {
            this.openSnackBar(error, CClient.SNACK_ACTION);
          });
          break;
        case CCommon.ON_WAITING:
          this.arenaID = parseInt(data.body, CClient.DECIMAL_BASE);
          this.socketService.sendMessage(CCommon.GAME_CONNECTION, CCommon.ON_WAITING);
          break;
        case CCommon.ON_ERROR:
          this.openSnackBar(data.body, CClient.SNACK_ACTION);
          break;
        default:
          break;
      }
    });
  }

  private async fetchSceneFromServer(path: string): Promise<void> {
    fetch(path).then((response) => {
      this.loadFileInObject(response)
      .catch((error) => {
        this.openSnackBar(error, CClient.SNACK_ACTION);
      });
    }).catch((error) => { this.openSnackBar(error, CClient.SNACK_ACTION); });
  }

  private async loadFileInObject(response: Response): Promise<void> {
    if (response.status !== CClient.SUCCESS_STATUS) {
      this.openSnackBar(response.statusText, CClient.SNACK_ACTION);
    } else {
      await response.json().then((variables: ISceneData<ISceneObject | IMesh>) => {
        this.assignSceneVariable(variables);
      }).catch((error) => { this.openSnackBar(error, CClient.SNACK_ACTION); });
    }
  }

  private assignSceneVariable(variables: ISceneData<ISceneObject | IMesh>): void {
    this.originalVariables = {
      theme:                  variables.originalScene.theme,
      gameName:               variables.originalScene.gameName,
      sceneBackgroundColor:   variables.originalScene.sceneBackgroundColor,
      sceneObjects:           variables.originalScene.sceneObjects,
      sceneObjectsQuantity:   variables.originalScene.sceneObjectsQuantity,
    };
    this.modifiedVariables = {
      theme:                  variables.originalScene.theme,
      gameName:               variables.modifiedScene.gameName,
      sceneBackgroundColor:   variables.modifiedScene.sceneBackgroundColor,
      sceneObjects:           variables.modifiedScene.sceneObjects,
      sceneObjectsQuantity:   variables.modifiedScene.sceneObjectsQuantity,
    };
    if (variables.meshInfos) {
      this.meshInfos = variables.meshInfos;
    }
  }

  private openSnackBar(msg: string, action: string): void {
    this.snackBar.open(msg, action, {
      duration:           CClient.SNACKBAR_DURATION,
      verticalPosition:   "top",
    });
  }

  private canvasRoutine(): void {
    this.gameViewService.setSounds(this.successSound, this.failSound, this.opponentSound, this.gameWon, this.gameLost, this.music);
  }

  private setCheaterState(value: boolean): void {
    this.isCheater = value;
  }
}
