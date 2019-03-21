import { ElementRef, Injectable } from "@angular/core";
import { Constants } from "src/app/constants";
import {
  IArenaResponse,
  IClickMessage,
  IOriginalPixelCluster,
  IPosition2D,
  IReplacementPixel
 } from "../../../../../common/communication/iGameplay";
import { CCommon } from "../../../../../common/constantes/cCommon";

@Injectable({
  providedIn: "root",
})

export class GameViewSimpleService {

  private canvasOriginal:        CanvasRenderingContext2D;
  private canvasModified:        CanvasRenderingContext2D;
  private successSound:          ElementRef;
  private failSound:             ElementRef;
  private textCanvasOriginal:    HTMLDivElement;
  private textCanvasModified:    HTMLDivElement;
  private position:              IPosition2D;

  public onArenaResponse(data: IArenaResponse<IOriginalPixelCluster>): void {
    if (data.status === CCommon.ON_SUCCESS) {
      this.playSuccessSound();
      if (data.response) {
        data.response.cluster.forEach((pixel: IReplacementPixel) => {
          this.canvasModified.fillStyle = "rgb(" + pixel.color.R + ", " + pixel.color.G + ", " + pixel.color.B + ")";
          this.canvasModified.fillRect(pixel.position.x, pixel.position.y, 1, 1);
        });
      }
    }
  }

  public wrongClickRoutine(): void {
    this.playFailSound();
    this.disableClickRoutine();
  }

  public enableClickRoutine(): void {
    document.body.style.cursor = "auto";
    this.canvasModified.canvas.style.cursor = "auto";
    this.canvasOriginal.canvas.style.cursor = "auto";
    this.textCanvasOriginal.textContent = null;
    this.textCanvasModified.textContent = null;
  }

  private disableClickRoutine(): void {
    document.body.style.cursor    = "not-allowed";
    this.canvasModified.canvas.style.cursor = "not-allowed";
    this.canvasOriginal.canvas.style.cursor = "not-allowed";
    const positionTop: number     = this.position.y - Constants.CENTERY;
    const positionRight: number   = this.position.x - Constants.CENTERX;

    this.textCanvasOriginal.style.top   = positionTop     + "px";
    this.textCanvasOriginal.style.left  = positionRight   + "px";
    this.textCanvasModified.style.top   = positionTop     + "px";
    this.textCanvasModified.style.left  = positionRight   + "px";
    this.textCanvasOriginal.textContent = Constants.ERROR_MESSAGE;
    this.textCanvasModified.textContent = Constants.ERROR_MESSAGE;
  }

  private playFailSound(): void {
    this.failSound.nativeElement.currentTime = 0;
    this.failSound.nativeElement.play();
  }

  private playSuccessSound(): void {
    this.successSound.nativeElement.currentTime = 0;
    this.successSound.nativeElement.play();
  }

  public setCanvas(modified: CanvasRenderingContext2D, original: CanvasRenderingContext2D): void {
    this.canvasModified = modified;
    this.canvasOriginal = original;
  }

  public setText(text1: ElementRef, text2: ElementRef): void {
    this.textCanvasOriginal = text1.nativeElement;
    this.textCanvasModified = text2.nativeElement;
  }

  public setSounds(success: ElementRef, fail: ElementRef): void {
    this.successSound = success;
    this.failSound    = fail;
  }

  public onCanvasClick(pos: IPosition2D, id: number, username: string): IClickMessage<IPosition2D> {
    this.position = pos;

    return {
      value:        pos,
      arenaID:      id,
      username:     username,
    };
  }
}
