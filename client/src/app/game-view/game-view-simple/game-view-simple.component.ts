import { HttpClient } from "@angular/common/http";
import { AfterContentInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { first } from "rxjs/operators";
import { GameConnectionService } from "src/app/game-connection.service";
import { GameMode, ICard } from "../../../../../common/communication/iCard";
import { IGameRequest } from "../../../../../common/communication/iGameRequest";
import { IClickMessage, IPenalty, IPosition2D } from "../../../../../common/communication/iGameplay";
import { Message } from "../../../../../common/communication/message";
import { CCommon } from "../../../../../common/constantes/cCommon";
import { Constants } from "../../constants";
import { SocketService } from "../../websocket/socket.service";
import { ChatViewComponent } from "../chat-view/chat-view.component";
import { GameViewSimpleService } from "./game-view-simple.service";

@Component({
  selector:     "app-game-view-simple",
  templateUrl:  "./game-view-simple.component.html",
  styleUrls:    ["./game-view-simple.component.css"],
})

export class GameViewSimpleComponent implements OnInit, AfterContentInit, OnDestroy {
  public readonly OPPONENT:       string = "Adversaire";
  public readonly SUCCESS_SOUND:  string = "http://localhost:3000/audio/fail.wav";
  public readonly FAIL_SOUND:     string = "http://localhost:3000/audio/success.wav";

  @ViewChild("successSound",  {read: ElementRef})  public successSound:    ElementRef;
  @ViewChild("failSound",     {read: ElementRef})  public failSound:       ElementRef;
  @ViewChild("erreurText",    {read: ElementRef})  public erreurText:      ElementRef;
  @ViewChild("erreurText2",   {read: ElementRef})  public erreurText2:     ElementRef;
  @ViewChild("originalImage", {read: ElementRef})  public canvasOriginal:  ElementRef;
  @ViewChild("modifiedImage", {read: ElementRef})  public canvasModified:  ElementRef;
  @ViewChild("chat")          private chat:        ChatViewComponent;

  public activeCard:      ICard;
  public cardLoaded:      boolean;
  public gameIsStarted:   boolean;
  public username:        string | null;
  public mode:            number;
  public arenaID:         number;
  public gameID:          number;
  private originalPath:   string;
  private gameRequest:    IGameRequest;
  private modifiedPath:   string;
  private position:       IPosition2D;

  public constructor(
    @Inject(GameViewSimpleService)  public  gameViewService:  GameViewSimpleService,
    @Inject(SocketService)          private socketService:    SocketService,
    private gameConnectionService:  GameConnectionService,
    private route:                  ActivatedRoute,
    private httpClient:             HttpClient,
    ) {
      this.mode           = Number(this.route.snapshot.paramMap.get("gamemode"));
      this.cardLoaded     = false;
      this.gameIsStarted  = false;
      this.username       = sessionStorage.getItem(Constants.USERNAME_KEY);
      this.position       = {x: 0, y: 0};
      this.gameConnectionService.getGameConnectedListener().pipe(first()).subscribe((arenaID: number) => {
        this.arenaID = arenaID;
        this.socketService.sendMessage(CCommon.GAME_CONNECTION, arenaID);
        this.canvasRoutine();
        this.socketService.sendMessage(CCommon.ON_GAME_LOADED, this.arenaID);
      });
    }

  public ngOnInit(): void {
    this.gameID = Number(this.route.snapshot.paramMap.get(Constants.ID_BY_URL));
    if (this.gameID !== null && this.username !== null) {
      this.getActiveCard(this.username);
    }
    this.socketService.onMessage(CCommon.ON_GAME_STARTED).subscribe(() => {
      this.chat.chatViewService.clearConversations();
      this.gameIsStarted = true;
    });
  }

  public ngAfterContentInit(): void {
    this.initListener();
    this.socketService.onMessage(CCommon.ON_PENALTY).subscribe((arenaResponse: IPenalty) => {
      if (arenaResponse.isOnPenalty) {
        this.wrongClickRoutine();
      } else {
        this.enableClickRoutine();
      }
    });
  }

  public ngOnDestroy(): void {
    this.socketService.sendMessage(CCommon.GAME_DISCONNECT, this.username);
  }

  private getActiveCard(username: string): void {
    if (this.gameID !== null) {
      this.httpClient.get(Constants.PATH_TO_GET_CARD + this.gameID + "/" + GameMode.simple).subscribe((response: ICard) => {
        this.activeCard = response;
        this.cardLoaded = true;
        this.createGameRequest(username);
      });
      this.originalPath = Constants.PATH_TO_IMAGES + "/" + this.gameID + CCommon.ORIGINAL_FILE;
      this.modifiedPath = Constants.PATH_TO_IMAGES + "/" + this.gameID + CCommon.MODIFIED_FILE;
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
  this.httpClient.post(Constants.GAME_REQUEST_PATH, this.gameRequest).subscribe((data: Message) => {
      if (data.title === CCommon.ON_SUCCESS) {
        this.arenaID = parseInt(data.body, Constants.DECIMAL_BASE);
        this.socketService.sendMessage(CCommon.GAME_CONNECTION, this.arenaID);
        this.canvasRoutine();
        this.socketService.sendMessage(CCommon.ON_GAME_LOADED, this.arenaID);
      } else if (data.title === CCommon.ON_WAITING) {
        this.arenaID = parseInt(data.body, Constants.DECIMAL_BASE);
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
    this.gameViewService.setSounds(this.successSound, this.failSound);
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
    const positionTop: number                       = this.position.y - Constants.CENTERY;
    const positionRight: number                     = this.position.x - Constants.CENTERX;

    this.erreurText.nativeElement.style.top     = positionTop     + "px";
    this.erreurText.nativeElement.style.left    = positionRight   + "px";
    this.erreurText2.nativeElement.style.top    = positionTop     + "px";
    this.erreurText2.nativeElement.style.left   = positionRight   + "px";
    this.erreurText.nativeElement.textContent   = Constants.ERROR_MESSAGE;
    this.erreurText2.nativeElement.textContent  = Constants.ERROR_MESSAGE;
  }

}
