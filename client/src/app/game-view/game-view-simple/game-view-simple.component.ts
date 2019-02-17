import { HttpClient } from "@angular/common/http";
import { AfterContentInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { GameMode, ICard } from "../../../../../common/communication/iCard"
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
  @ViewChild("modifiedImage", {read: ElementRef})
  public canvasModified: ElementRef;
  private originalPath: string;
  private modifiedPath: string;

  public constructor(
    @Inject(GameViewSimpleService) public gameViewService: GameViewSimpleService,
    @Inject(SocketService) private socketService: SocketService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    ) {
      const temp: string | null = this.route.snapshot.paramMap.get("id");
      if (temp !== null) {
        this.activeCard.gameID = parseInt(temp, 10);
        this.originalPath = Constants.PATH_TO_IMAGES + "/" + this.activeCard.gameID + Constants.ORIGINAL_FILE;
        this.modifiedPath = Constants.PATH_TO_IMAGES + "/" + this.activeCard.gameID + Constants.MODIFIED_FILE;
      }
    }

  public ngOnInit(): void {
    this.httpClient.get(Constants.PATH_TO_GET_CARD + this.activeCard.gameID + "/" + GameMode.simple).subscribe((response: ICard) => {

    })
    this.canvasRoutine();
  }

  public ngAfterContentInit(): void {
      // test will be changed to something else, To be determined
      this.socketService.sendMsg(Constants.ON_GAME_CONNECTION, "test");
      this.initListener();
    }

  public ngOnDestroy(): void {
        // test will be changed to something else, To be determined
        this.socketService.sendMsg(Constants.ON_GAME_DISCONNECT, "test");
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
  }

  public initListener(): void {

    this.canvasOriginal.nativeElement.addEventListener("click", (mouseEvent: MouseEvent) => {
      this.gameViewService.onCanvasClick(mouseEvent.offsetX, mouseEvent.offsetY);
    });
    this.canvasModified.nativeElement.addEventListener("click", (mouseEvent: MouseEvent) => {
      this.gameViewService.onCanvasClick(mouseEvent.offsetX, mouseEvent.offsetY);
    });
  }

}
