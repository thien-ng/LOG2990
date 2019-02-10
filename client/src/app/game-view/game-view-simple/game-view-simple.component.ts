import { AfterContentInit, Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { GameViewSimpleService } from "./game-view-simple.service";
@Component({
  selector: "app-game-view-simple",
  templateUrl: "./game-view-simple.component.html",
  styleUrls: ["./game-view-simple.component.css"],
})

export class GameViewSimpleComponent implements AfterContentInit {

  @ViewChild("originalImage", {read: ElementRef})
  public canvasOriginal: ElementRef;
  @ViewChild("modifiedImage", {read: ElementRef})
  public canvasModified: ElementRef;

  public constructor(@Inject(GameViewSimpleService) public gameViewService: GameViewSimpleService) {
    // default constructor
  }

  public ngAfterContentInit(): void {
    this.initListener();
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
