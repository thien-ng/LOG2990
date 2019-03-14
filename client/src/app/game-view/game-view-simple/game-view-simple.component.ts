import { HttpClient } from "@angular/common/http";
import { AfterContentInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { first } from "rxjs/operators";
import { GameConnectionService } from "src/app/game-connection.service";
import { GameMode, ICard } from "../../../../../common/communication/iCard";
import { IGameRequest } from "../../../../../common/communication/iGameRequest";
import { IClickMessage, IPosition2D } from "../../../../../common/communication/iGameplay";
import { Message } from "../../../../../common/communication/message";
import { CCommon } from "../../../../../common/constantes/cCommon";
import { Constants } from "../../constants";
import { SocketService } from "../../websocket/socket.service";
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

  @ViewChild("successSound",  {read: ElementRef})
  public successSound:    ElementRef;
  @ViewChild("failSound",     {read: ElementRef})
  public failSound:       ElementRef;
  @ViewChild("originalImage", {read: ElementRef})
  public canvasOriginal:  ElementRef;
  @ViewChild("modifiedImage", {read: ElementRef})
  public canvasModified:  ElementRef;

  public activeCard:      ICard;
  public cardLoaded:      boolean;
  public gameStarted:     boolean;
  public username:        string | null;
  public mode:            number;
  public arenaID:         number;
  public gameID:         number;
  private originalPath:   string;
  private gameRequest:    IGameRequest;
  private modifiedPath:   string;

  public constructor(
    @Inject(GameViewSimpleService) public   gameViewService:  GameViewSimpleService,
    @Inject(SocketService)          private socketService:    SocketService,
    private route:      ActivatedRoute,
    private httpClient: HttpClient,
    ) {
      this.mode       = this.route.snapshot.paramMap.get("gamemode");
      this.cardLoaded = false;
      this.username   = sessionStorage.getItem(Constants.USERNAME_KEY);
    }

  public ngOnInit(): void {
    const gameID: string | null = this.route.snapshot.paramMap.get(Constants.ID_BY_URL);
    if (gameID !== null && this.username !== null) {
      this.getActiveCard(this.username);
      this.canvasRoutine();
    }
  }

  public ngAfterContentInit(): void {
    this.initListener();
  }

  private createGameRequest(username: string): void {
    if (this.mode !== null) {
      this.gameRequest = {
        username:   username,
        gameId:     this.activeCard.gameID,
        type:       JSON.parse(this.mode),
        mode:       GameMode.simple,
      };
      this.handleGameRequest();
    }
 }

  private handleGameRequest(): void {
  this.httpClient.post(Constants.GAME_REQUEST_PATH, this.gameRequest).subscribe((data: Message) => {
      if (data.title === CCommon.ON_SUCCESS) {
        this.arenaID = parseInt(data.body, Constants.DECIMAL_BASE);
        this.socketService.sendMsg(CCommon.GAME_CONNECTION, this.arenaID);
      }
    });
  }

  public ngOnDestroy(): void {
    this.socketService.sendMsg(CCommon.GAME_DISCONNECT, this.username);
  }

  private getActiveCard(username: string): void {
    const gameID: string | null = this.route.snapshot.paramMap.get("id");
    if (gameID !== null) {
      this.httpClient.get(Constants.PATH_TO_GET_CARD + gameID + "/" + GameMode.simple).subscribe((response: ICard) => {
        this.activeCard = response;
        this.cardLoaded = true;
        this.createGameRequest(username);
      });
      this.originalPath = Constants.PATH_TO_IMAGES + "/" + gameID + CCommon.ORIGINAL_FILE;
      this.modifiedPath = Constants.PATH_TO_IMAGES + "/" + gameID + CCommon.MODIFIED_FILE;
    }
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
      const pos: IPosition2D = {
        x:    mouseEvent.offsetX,
        y:    mouseEvent.offsetY,
      };

      if (this.username !== null) {
        const canvasPosition: IClickMessage = this.gameViewService.onCanvasClick(pos, this.arenaID, this.username);
        this.socketService.sendMsg(Constants.ON_POSITION_VALIDATION, canvasPosition);
      }
    });
    this.canvasModified.nativeElement.addEventListener("click", (mouseEvent: MouseEvent) => {
      const pos: IPosition2D = {
        x:    mouseEvent.offsetX,
        y:    mouseEvent.offsetY,
      };

      if (this.username !== null) {
        const canvasPosition: IClickMessage = this.gameViewService.onCanvasClick(pos, this.arenaID, this.username);
        this.socketService.sendMsg(Constants.ON_POSITION_VALIDATION, canvasPosition);
      }
    });
  }
}
