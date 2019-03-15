import { ElementRef, Injectable } from "@angular/core";
import { IClickMessage, IPlayerInputResponse, IPosition2D } from "../../../../../common/communication/iGameplay";
import { CCommon } from "../../../../../common/constantes/cCommon";

const DELAY:            number = 1000;
const CENTERY:          number = 15;
const CENTERX:          number = 50;
const PADDING_CANVAS_2: number = 640;

@Injectable({
  providedIn: "root",
})

export class GameViewSimpleService {

  public canvasOriginal:  CanvasRenderingContext2D;
  public canvasModified:  CanvasRenderingContext2D;
  public successSound:    ElementRef;
  public failSound:       ElementRef;
  public text1div:        HTMLDivElement;
  public text2div:        HTMLDivElement;
  private position:       IPosition2D;

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


  private disableClickRoutine(canvasback: HTMLCanvasElement): void {
      document.body.style.cursor = "not-allowed";
      this.canvasModified.canvas.style.pointerEvents = "none";
      this.canvasOriginal.canvas.style.pointerEvents = "none";
      this.canvasOriginal.font = "30px Verdana";
      this.canvasOriginal.fillStyle = "red";
      this.canvasOriginal.fillText("hello", this.position.x, this.position.y);
      window.setTimeout(() => this.enableClickRoutine(canvasback) , DELAY);
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
