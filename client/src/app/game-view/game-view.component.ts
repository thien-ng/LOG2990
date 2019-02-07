import { Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { GameViewService } from "./game-view.service";

@Component({
  selector: "app-game-view",
  templateUrl: "./game-view.component.html",
  styleUrls: ["./game-view.component.css"],
})

export class GameViewComponent {

  @ViewChild("originalImage", {read: ElementRef})
  public canvasOriginal: ElementRef;
  @ViewChild("modifiedImage", {read: ElementRef})
  public canvasModified: ElementRef;

  public constructor(@Inject(GameViewService) public gameViewService: GameViewService) {
    // default constructor
  }

  public getMousePositionOriginal(): void {
    this.canvasOriginal.nativeElement.addEventListener("click", (mouseEvent: MouseEvent) => {
      this.gameViewService.onCanvasClick(mouseEvent.offsetX, mouseEvent.offsetY);
    });
  }

  public getMousePositionModified(): void {
    this.canvasModified.nativeElement.addEventListener("click", (mouseEvent: MouseEvent) => {
      this.gameViewService.onCanvasClick(mouseEvent.offsetX, mouseEvent.offsetY);
    });
  }
}
