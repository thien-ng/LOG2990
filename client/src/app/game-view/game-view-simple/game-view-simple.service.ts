import { ElementRef, Injectable } from "@angular/core";
import { IClickMessage, IPlayerInputResponse, IPosition2D } from "../../../../../common/communication/iGameplay";
import { CCommon } from "../../../../../common/constantes/cCommon";

const DELAY:            number = 1000;
const CENTERY:          number = 15;
const CENTERX:          number = 50;
const PADDING_CANVAS_2: number = 640;
const ERROR_MESSAGE:    string = "⚠ ERREUR ⚠";

@Injectable({
  providedIn: "root",
})

export class GameViewSimpleService {

  public canvasOriginal:        CanvasRenderingContext2D;
  public canvasModified:        CanvasRenderingContext2D;
  public successSound:          ElementRef;
  public failSound:             ElementRef;
  public textCanvasOriginal:    HTMLDivElement;
  public textCanvasModified:    HTMLDivElement;
  private position:             IPosition2D;

  public onArenaResponse(data: IPlayerInputResponse): void {
    if (data.status === CCommon.ON_SUCCESS) {
      this.playSuccessSound();
      data.response.cluster.forEach((pixel) => {
        this.canvasModified.fillStyle = "rgb(" + pixel.color.R + ", " + pixel.color.G + ", " + pixel.color.B + ")";
        this.canvasModified.fillRect(pixel.position.x, pixel.position.y, 1, 1);
      });
    } else {
      this.playFailSound();
      this.disableClickRoutine();
    }
  }

  private enableClickRoutine(): void {
    document.body.style.cursor = "auto";
    this.canvasModified.canvas.style.pointerEvents = "auto";
    this.canvasOriginal.canvas.style.pointerEvents = "auto";
    this.textCanvasOriginal.textContent = null;
    this.textCanvasModified.textContent = null;
  }

  private disableClickRoutine(): void {
      document.body.style.cursor = "not-allowed";
      const positionTop: number = this.position.y - CENTERY;
      const positionRight: number = this.position.x - CENTERX;
      const positionRight2: number = this.position.x + PADDING_CANVAS_2 - CENTERX;
      this.textCanvasOriginal.style.top =  positionTop + "px";
      this.textCanvasOriginal.style.left = positionRight + "px";
      this.textCanvasModified.style.top = positionTop + "px";
      this.textCanvasModified.style.left = positionRight2 + "px";
      this.textCanvasOriginal.textContent = ERROR_MESSAGE;
      this.textCanvasModified.textContent = ERROR_MESSAGE;
      this.canvasModified.canvas.style.pointerEvents = "none";
      this.canvasOriginal.canvas.style.pointerEvents = "none";
      window.setTimeout(() => this.enableClickRoutine() , DELAY);
}

  public playFailSound(): void {
    this.failSound.nativeElement.currentTime = 0;
    this.failSound.nativeElement.play();
  }

  public playSuccessSound(): void {
    this.successSound.nativeElement.currentTime = 0;
    this.successSound.nativeElement.play();
  }

  public setCanvas(modified: CanvasRenderingContext2D, original: CanvasRenderingContext2D): void {
    this.canvasModified = modified;
    this.canvasOriginal = original;
  }

  public setSounds(success: ElementRef, fail: ElementRef): void {
    this.successSound = success;
    this.failSound    = fail;
  }

  public onCanvasClick(pos: IPosition2D, id: number, username: string): IClickMessage {
    this.position = pos;

    return {
      position:     pos,
      arenaID:      id,
      username:     username,
    };
  }
}
