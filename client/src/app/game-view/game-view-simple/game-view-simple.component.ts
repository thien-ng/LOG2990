import { AfterContentInit, Component, ElementRef, Inject, OnDestroy, ViewChild } from "@angular/core";
import { GameViewSimpleService } from "./game-view-simple.service";
import { SocketService } from "../../websocket/socket.service";

@Component({
  selector: "app-game-view-simple",
  templateUrl: "./game-view-simple.component.html",
  styleUrls: ["./game-view-simple.component.css"],
})

export class GameViewSimpleComponent implements AfterContentInit, OnDestroy {

  @ViewChild("originalImage", {read: ElementRef})
  public canvasOriginal: ElementRef;
  @ViewChild("modifiedImage", {read: ElementRef})
  public canvasModified: ElementRef;

  public constructor(@Inject(GameViewSimpleService) public gameViewService: GameViewSimpleService,
                    @Inject(SocketService) private socketService: SocketService) {}

  public ngAfterContentInit(): void {
    this.socketService.sendMsg("onGameConnection", "test");
    this.initListener();
  }

  public ngOnDestroy(): void {
    this.socketService.sendMsg("onGameDisconnect", "test");
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
