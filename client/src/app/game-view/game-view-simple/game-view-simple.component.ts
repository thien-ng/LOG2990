import { AfterContentInit, Component, ElementRef, Inject, ViewChild, OnInit } from "@angular/core";
import { ActiveGameService } from "../active-game.service";
import { GameViewSimpleService } from "./game-view-simple.service";

@Component({
  selector: "app-game-view-simple",
  templateUrl: "./game-view-simple.component.html",
  styleUrls: ["./game-view-simple.component.css"],
})

export class GameViewSimpleComponent implements OnInit, AfterContentInit {

  @ViewChild("originalImage", {read: ElementRef})
  public canvasOriginal: ElementRef;
  @ViewChild("modifiedImage", {read: ElementRef})
  public canvasModified: ElementRef;

  public constructor(
    @Inject(GameViewSimpleService) public gameViewService: GameViewSimpleService,
    public activeGameService: ActiveGameService,
    ) {}

  public ngAfterContentInit(): void {
    this.initListener();
  }

  public ngOnInit(): void {
    const canvasOriginal: CanvasRenderingContext2D = this.canvasOriginal.nativeElement.getContext("2d");
    const canvasModified: CanvasRenderingContext2D = this.canvasModified.nativeElement.getContext("2d");
    const imgModified: HTMLImageElement = new Image();
    const imgOriginal: HTMLImageElement = new Image();
    imgOriginal.src = this.activeGameService.originalImage;
    imgModified.src = this.activeGameService.modifiedImage;
    imgOriginal.onload = () => {
      canvasOriginal.drawImage(imgOriginal, 0, 0);
    };

    imgModified.onload = () => {
      canvasModified.drawImage(imgModified, 0, 0);
    }
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
