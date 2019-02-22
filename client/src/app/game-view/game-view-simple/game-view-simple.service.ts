import { ElementRef, Injectable } from "@angular/core";
import { IClickMessage, IPlayerInputResponse, IPosition2D } from "../../../../../common/communication/iGameplay";
import { Constants } from "../../constants";

@Injectable({
  providedIn: "root",
})

export class GameViewSimpleService {

  public canvasModified:  CanvasRenderingContext2D;
  public successSound:    ElementRef;
  public failSound:       ElementRef;

  public onArenaResponse(data: IPlayerInputResponse): void {
    if (data.status === Constants.ON_SUCCESS_MESSAGE) {
      this.playSuccessSound();
      data.response.cluster.forEach((pixel) => {
        this.canvasModified.fillStyle = "rgb(" + pixel.color.R + ", " + pixel.color.G + ", " + pixel.color.B + ")";
        this.canvasModified.fillRect(pixel.position.x, pixel.position.y, 1, 1);
      });
    } else {
      this.playFailSound();
    }
  }

  public playFailSound(): void {
    this.failSound.nativeElement.currentTime = 0;
    this.failSound.nativeElement.play();
  }

  public playSuccessSound(): void {
    this.successSound.nativeElement.currentTime = 0;
    this.successSound.nativeElement.play();
  }

  public setCanvas(modified: CanvasRenderingContext2D): void {
    this.canvasModified = modified;
  }

  public setSounds(success: ElementRef, fail: ElementRef): void {
    this.successSound = success;
    this.failSound = fail;
  }

  public onCanvasClick(pos: IPosition2D, id: number, username: string): IClickMessage {
    return {
      position: pos,
      arenaID: id,
      username: username,
    };
  }
}
