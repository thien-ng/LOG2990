import { HttpClient } from "@angular/common/http";
import { AfterContentInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GameMode, ICard } from "../../../../../common/communication/iCard";
import { IGameRequest } from "../../../../../common/communication/iGameRequest";
import { IClickMessage, IPosition2D } from "../../../../../common/communication/iGameplay";
import { Message } from "../../../../../common/communication/message";
import { Constants } from "../../constants";
import { SocketService } from "../../websocket/socket.service";
import { GameViewSimpleService } from "./game-view-simple.service";

@Component({
  selector: "app-game-view-simple",
  templateUrl: "./game-view-simple.component.html",
  styleUrls: ["./game-view-simple.component.css"],
})

export class GameViewSimpleComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild("originalImage", {read: ElementRef})
  public canvasOriginal: ElementRef;
  public activeCard: ICard;
  public cardLoaded: boolean;
  @ViewChild("modifiedImage", {read: ElementRef})
  public canvasModified: ElementRef;
  private originalPath: string;
  private gameRequest: IGameRequest;
  private modifiedPath: string;
  private arenaID: number;
  private username: string | null;

  public constructor(
    @Inject(GameViewSimpleService) public gameViewService: GameViewSimpleService,
    @Inject(SocketService) private socketService: SocketService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    ) {
      this.cardLoaded = false;
      this.username = sessionStorage.getItem(Constants.USERNAME_KEY);
    }

  public ngOnInit(): void {
    const gameID: string | null = this.route.snapshot.paramMap.get(Constants.ID_BY_URL);
    if (gameID !== null && this.username !== null) {
      this.getActiveCard(this.username);
      this.canvasRoutine();
    }
  }

  public ngAfterContentInit(): void {
    // test will be changed to something else, To be determined
    this.socketService.sendMsg(Constants.ON_GAME_CONNECTION, Constants.ON_GAME_CONNECTION);
    this.initListener();
  }

  private createGameRequest(username: string): void {
    const mode: string | null = this.route.snapshot.paramMap.get("gamemode");
    if (mode !== null) {
      this.gameRequest = {
        username: username,
        gameId: this.activeCard.gameID,
        type: JSON.parse(mode),
        mode: GameMode.simple,
      };
      this.handleGameRequest();
    }
 }

  private handleGameRequest(): void {
  this.httpClient.post(Constants.GAME_REQUEST_PATH, this.gameRequest).subscribe((data: Message) => {
      if (data.title === Constants.ON_SUCCESS_MESSAGE) {
        this.arenaID = parseInt(data.body, Constants.DECIMAL);
      }
    });
  }

  public ngOnDestroy(): void {
    // test will be changed to something else, To be determined
    this.socketService.sendMsg(Constants.ON_GAME_DISCONNECT, "test");
  }

  private getActiveCard(username: string): void {
    const gameID: string | null = this.route.snapshot.paramMap.get("id");
    if (gameID !== null) {
      this.httpClient.get(Constants.PATH_TO_GET_CARD + gameID + "/" + GameMode.simple).subscribe((response: ICard) => {
        this.activeCard = response;
        this.cardLoaded = true;
        this.createGameRequest(username);
      });
      this.originalPath = Constants.PATH_TO_IMAGES + "/" + gameID + Constants.ORIGINAL_FILE;
      this.modifiedPath = Constants.PATH_TO_IMAGES + "/" + gameID + Constants.MODIFIED_FILE;
    }
  }

  private canvasRoutine(): void {
    const canvasOriginal: CanvasRenderingContext2D = this.canvasOriginal.nativeElement.getContext("2d");
    const canvasModified: CanvasRenderingContext2D = this.canvasModified.nativeElement.getContext("2d");
    const imgModified: HTMLImageElement = new Image();
    const imgOriginal: HTMLImageElement = new Image();
    imgOriginal.src = this.originalPath;
    imgModified.src = this.modifiedPath;
    imgOriginal.onload = () => {
      canvasOriginal.drawImage(imgOriginal, 0, 0);
    };

    imgModified.onload = () => {
      canvasModified.drawImage(imgModified, 0, 0);
    };
    this.gameViewService.setCanvas(canvasModified);
  }

  public initListener(): void {
    this.canvasOriginal.nativeElement.addEventListener("click", (mouseEvent: MouseEvent) => {
      const pos: IPosition2D = {
        x: mouseEvent.offsetX,
        y: mouseEvent.offsetY,
      };
      if (this.username !== null) {
        const canvasPosition: IClickMessage = this.gameViewService.onCanvasClick(pos, this.arenaID, this.username);
        this.socketService.sendMsg(Constants.ON_POSITION_VALIDATION, canvasPosition);
      }
    });
    this.canvasModified.nativeElement.addEventListener("click", (mouseEvent: MouseEvent) => {
      const pos: IPosition2D = {
        x: mouseEvent.offsetX,
        y: mouseEvent.offsetY,
      };
      if (this.username !== null) {
        const canvasPosition: IClickMessage = this.gameViewService.onCanvasClick(pos, this.arenaID, this.username);
        this.socketService.sendMsg(Constants.ON_POSITION_VALIDATION, canvasPosition);
      }
    });
  }

}
