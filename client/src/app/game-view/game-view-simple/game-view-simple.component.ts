import { HttpClient } from "@angular/common/http";
import { AfterContentInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatDialogConfig } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { first } from "rxjs/operators";
import { GameConnectionService } from "src/app/game-connection.service";
import { Mode } from "../../../../../common/communication/highscore";
import { GameMode, ICard } from "../../../../../common/communication/iCard";
import { IGameRequest } from "../../../../../common/communication/iGameRequest";
import { IClickMessage, INewGameInfo, IPenalty, IPosition2D } from "../../../../../common/communication/iGameplay";
import { Message } from "../../../../../common/communication/message";
import { CCommon } from "../../../../../common/constantes/cCommon";
import { CClient } from "../../CClient";
import { SocketService } from "../../websocket/socket.service";
import { ChatViewComponent } from "../chat-view/chat-view.component";
import { EndGameDialogService } from "../endGameDialog/end-game-dialog.service";
import { GameViewSimpleService } from "./game-view-simple.service";

@Component({
  selector:     "app-game-view-simple",
  templateUrl:  "./game-view-simple.component.html",
  styleUrls:    ["./game-view-simple.component.css"],
  providers:    [EndGameDialogService, {provide: MatDialogConfig, useValue: {}}],
})

export class GameViewSimpleComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild("successSound",  {read: ElementRef})  public successSound:    ElementRef;
  @ViewChild("failSound",     {read: ElementRef})  public failSound:       ElementRef;
  @ViewChild("opponentSound", {read: ElementRef})  public opponentSound:   ElementRef;
  @ViewChild("gameWon",       {read: ElementRef})  public gameWon:         ElementRef;
  @ViewChild("gameLost",      {read: ElementRef})  public gameLost:        ElementRef;
  @ViewChild("music",         {read: ElementRef})  public music:           ElementRef;
  @ViewChild("erreurText",    {read: ElementRef})  public erreurText:      ElementRef;
  @ViewChild("erreurText2",   {read: ElementRef})  public erreurText2:     ElementRef;
  @ViewChild("originalImage", {read: ElementRef})  public canvasOriginal:  ElementRef;
  @ViewChild("modifiedImage", {read: ElementRef})  public canvasModified:  ElementRef;
  @ViewChild("chat")                               private chat:           ChatViewComponent;

  public readonly SUCCESS_SOUND:          string = CCommon.BASE_URL  + CCommon.BASE_SERVER_PORT + "/audio/fail.wav";
  public readonly FAIL_SOUND:             string = CCommon.BASE_URL  + CCommon.BASE_SERVER_PORT + "/audio/success.wav";
  public readonly OPPONENT_SOUND:         string = CCommon.BASE_URL  + CCommon.BASE_SERVER_PORT + "/audio/opponent_point.mp3";
  public readonly GAME_WON:               string = CCommon.BASE_URL  + CCommon.BASE_SERVER_PORT + "/audio/game-won.wav";
  public readonly GAME_LOST:              string = CCommon.BASE_URL  + CCommon.BASE_SERVER_PORT + "/audio/game-lost.wav";
  public readonly MUSIC:                  string = CCommon.BASE_URL  + CCommon.BASE_SERVER_PORT + "/audio/music.mp3";

  private originalPath:   string;
  private gameRequest:    IGameRequest;
  private modifiedPath:   string;
  private position:       IPosition2D;
  private subscription:   Subscription[];

  public activeCard:      ICard;
  public cardLoaded:      boolean;
  public gameIsStarted:   boolean;
  public isGameEnded:     boolean;
  public opponentName:    string;
  public username:        string | null;
  public mode:            Mode;
  public arenaID:         number;
  public gameID:          number;

  public constructor(
    @Inject(GameViewSimpleService)    public  gameViewService:      GameViewSimpleService,
    @Inject(SocketService)            private socketService:        SocketService,
    @Inject(EndGameDialogService)     private endGameDialogService: EndGameDialogService,
    private gameConnectionService:    GameConnectionService,
    private route:                    ActivatedRoute,
    private httpClient:               HttpClient,
    ) {
      this.mode           = Number(this.route.snapshot.paramMap.get("gamemode"));
      this.cardLoaded     = false;
      this.gameIsStarted  = false;
      this.isGameEnded    = false;
      this.username       = sessionStorage.getItem(CClient.USERNAME_KEY);
      this.position       = {x: 0, y: 0};
      this.subscription   = [];
      this.gameConnectionService.getGameConnectedListener().pipe(first()).subscribe((arenaID: number) => {
        this.arenaID = arenaID;
        this.socketService.sendMessage(CCommon.GAME_CONNECTION, arenaID);
        this.canvasRoutine();
        this.socketService.sendMessage(CCommon.ON_GAME_LOADED, this.arenaID);
      });
    }

  public ngOnInit(): void {
    this.gameID = Number(this.route.snapshot.paramMap.get(CClient.ID_BY_URL));
    if (this.gameID !== null && this.username !== null) {
      this.getActiveCard(this.username);
    }
    this.initEventSubscription();
  }

  public ngAfterContentInit(): void {
    this.initListener();
  }

  public ngOnDestroy(): void {
    this.socketService.sendMessage(CCommon.GAME_DISCONNECT, this.username);
    this.subscription.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
    this.endGameDialogService.closeDialog();
  }

  private initEventSubscription(): void {
    this.subscription.push(this.socketService.onMessage(CCommon.ON_PENALTY).subscribe((arenaResponse: IPenalty) => {
      (arenaResponse.isOnPenalty) ? this.wrongClickRoutine() : this.enableClickRoutine();
    }));

    this.subscription.push(this.socketService.onMessage(CCommon.ON_GAME_STARTED).subscribe(() => {
      this.chat.chatViewService.clearConversations();
      this.gameIsStarted = true;
      this.gameViewService.playMusic();
    }));

    this.initEndOfGameSubs();

    this.subscription.push(this.socketService.onMessage(CCommon.ON_COUNTDOWN_START).subscribe((message: string[]) => {
      const index: number = message[0] === this.username ? 1 : 0;
      this.opponentName = message[index];
    }));
  }

  private initEndOfGameSubs(): void {
    this.subscription.push(this.socketService.onMessage(CCommon.ON_GAME_ENDED).subscribe((message: string) => {
      const isWinner: boolean = message === CCommon.ON_GAME_WON;
      isWinner ? this.gameViewService.playWinSound() : this.gameViewService.playLossSound();
      this.gameViewService.stopMusic();
      this.isGameEnded = true;
      const newGameInfo: INewGameInfo = {
        path:   CClient.GAME_VIEW_SIMPLE_PATH,
        gameID: this.gameID,
        type:   this.mode,
      };
      this.endGameDialogService.openDialog(isWinner, newGameInfo, GameMode.simple);
    }));
  }

  private getActiveCard(username: string): void {
    if (this.gameID !== null) {
      this.httpClient.get(CClient.PATH_TO_GET_CARD + this.gameID + "/" + GameMode.simple).subscribe((response: ICard) => {
        this.activeCard = response;
        this.cardLoaded = true;
        this.createGameRequest(username);
      });
      this.originalPath = CClient.PATH_TO_IMAGES + "/" + this.gameID + CCommon.ORIGINAL_FILE;
      this.modifiedPath = CClient.PATH_TO_IMAGES + "/" + this.gameID + CCommon.MODIFIED_FILE;
    }
  }

  private createGameRequest(username: string): void {
    if (this.mode !== null) {
      this.gameRequest = {
        username:   username,
        gameId:     this.activeCard.gameID,
        type:       this.mode,
        mode:       GameMode.simple,
      };
      this.handleGameRequest();
    }
  }

  private handleGameRequest(): void {
  this.httpClient.post(CClient.GAME_REQUEST_PATH, this.gameRequest).subscribe((data: Message) => {
      if (data.title === CCommon.ON_SUCCESS) {
        this.arenaID = parseInt(data.body, CClient.DECIMAL_BASE);
        this.socketService.sendMessage(CCommon.GAME_CONNECTION, this.arenaID);
        this.canvasRoutine();
        this.socketService.sendMessage(CCommon.ON_GAME_LOADED, this.arenaID);
      } else if (data.title === CCommon.ON_WAITING) {
        this.arenaID = parseInt(data.body, CClient.DECIMAL_BASE);
        this.socketService.sendMessage(CCommon.GAME_CONNECTION, CCommon.ON_WAITING);
        this.gameIsStarted = false;
      }
    });
  }

  private canvasRoutine(): void {
    const canvasOriginal: CanvasRenderingContext2D  = this.canvasOriginal.nativeElement.getContext("2d");
    const canvasModified: CanvasRenderingContext2D  = this.canvasModified.nativeElement.getContext("2d");
    const imgModified:    HTMLImageElement          = new Image();
    const imgOriginal:    HTMLImageElement          = new Image();

    imgOriginal.src = this.originalPath;
    imgModified.src = this.modifiedPath;

    imgOriginal.onload = () => {
      canvasOriginal.drawImage(imgOriginal, 0, 0);
    };

    imgModified.onload = () => {
      canvasModified.drawImage(imgModified, 0, 0);
    };
    this.gameViewService.setCanvas(canvasModified);
    this.gameViewService.setSounds(this.successSound, this.failSound, this.opponentSound, this.gameWon, this.gameLost, this.music);
  }

  public initListener(): void {
    this.canvasOriginal.nativeElement.addEventListener("click", (mouseEvent: MouseEvent) => {
      this.sendClickEvent(mouseEvent);
    });
    this.canvasModified.nativeElement.addEventListener("click", (mouseEvent: MouseEvent) => {
      this.sendClickEvent(mouseEvent);
    });
  }

  private sendClickEvent(mouseEvent: MouseEvent): void {

    const position2d: IPosition2D = {
      x:    mouseEvent.offsetX,
      y:    mouseEvent.offsetY,
    };

    this.position = position2d;
    if (this.username !== null) {
      const canvasPosition: IClickMessage<IPosition2D> = this.gameViewService.onCanvasClick(position2d, this.arenaID, this.username);
      this.socketService.sendMessage(CCommon.POSITION_VALIDATION, canvasPosition);
    }
  }

  public wrongClickRoutine(): void {
    this.gameViewService.playFailSound();
    this.disableClickRoutine();
  }

  public enableClickRoutine(): void {
    document.body.style.cursor                     = "auto";
    this.canvasModified.nativeElement.style.cursor = "auto";
    this.canvasOriginal.nativeElement.style.cursor = "auto";
    this.erreurText.nativeElement.textContent      = null;
    this.erreurText2.nativeElement.textContent     = null;
  }

  private disableClickRoutine(): void {
    document.body.style.cursor                      = "not-allowed";
    this.canvasModified.nativeElement.style.cursor  = "not-allowed";
    this.canvasOriginal.nativeElement.style.cursor  = "not-allowed";
    const positionTop: number                       = this.position.y - CClient.CENTERY;
    const positionRight: number                     = this.position.x - CClient.CENTERX;

    this.erreurText.nativeElement.style.top     = positionTop     + "px";
    this.erreurText.nativeElement.style.left    = positionRight   + "px";
    this.erreurText2.nativeElement.style.top    = positionTop     + "px";
    this.erreurText2.nativeElement.style.left   = positionRight   + "px";
    this.erreurText.nativeElement.textContent   = CClient.ERROR_MESSAGE;
    this.erreurText2.nativeElement.textContent  = CClient.ERROR_MESSAGE;
  }

}
