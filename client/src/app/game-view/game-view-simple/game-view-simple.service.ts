import { ElementRef, Injectable } from "@angular/core";
import { CClient } from "src/app/CClient";
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

  private canvasModified:        CanvasRenderingContext2D;
  private successSound:          ElementRef;
  private failSound:             ElementRef;
  private opponentSound:         ElementRef;
  private gameWon:               ElementRef;
  private gameLost:              ElementRef;

  public onArenaResponse(data: IArenaResponse<IOriginalPixelCluster>): void {
    const isSuccess: boolean      = data.status === CCommon.ON_SUCCESS;
    const isRightPlayer: boolean  = data.username === sessionStorage.getItem(CClient.USERNAME_KEY);
    if (isSuccess) {
      if (data.response) {
        (isRightPlayer) ? this.playSuccessSound() : this.playOpponentSound();
        data.response.cluster.forEach((pixel: IReplacementPixel) => {
          this.canvasModified.fillStyle = "rgb(" + pixel.color.R + ", " + pixel.color.G + ", " + pixel.color.B + ")";
          this.canvasModified.fillRect(pixel.position.x, pixel.position.y, 1, 1);
        });
      }
    }
  }

  public playFailSound(): void {
    this.failSound.nativeElement.currentTime = 0;
    this.failSound.nativeElement.play();
  }

  public playWinSound(): void {
    this.gameWon.nativeElement.currentTime = 0;
    this.gameWon.nativeElement.play();
  }

  public playLossSound(): void {
    this.gameLost.nativeElement.currentTime = 0;
    this.gameLost.nativeElement.play();
  }

  private playSuccessSound(): void {
    this.successSound.nativeElement.currentTime = 0;
    this.successSound.nativeElement.play();
  }

  private playOpponentSound(): void {
    this.opponentSound.nativeElement.currentTime = 0;
    this.opponentSound.nativeElement.play();
  }

  public setCanvas(modified: CanvasRenderingContext2D): void {
    this.canvasModified = modified;
  }

  public setSounds(success: ElementRef, fail: ElementRef, opponentSound: ElementRef, gameWon: ElementRef, gameLost: ElementRef): void {
    this.successSound   = success;
    this.failSound      = fail;
    this.opponentSound  = opponentSound;
    this.gameWon        = gameWon;
    this.gameLost       = gameLost;
  }

  public onCanvasClick(pos: IPosition2D, id: number, username: string): IClickMessage<IPosition2D> {

    return {
      value:        pos,
      arenaID:      id,
      username:     username,
    };
  }
}
