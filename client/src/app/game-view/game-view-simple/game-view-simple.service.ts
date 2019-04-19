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

const START_TIME:         number = 0;
@Injectable({
  providedIn: "root",
})

export class GameViewSimpleService {

  private canvasModified:        CanvasRenderingContext2D;
  private successSound:          ElementRef;
  private failSound:             ElementRef;
  private opponentSound:         ElementRef;
  private winSound:              ElementRef;
  private lossSound:             ElementRef;
  private music:                 ElementRef;

  public onArenaResponse(data: IArenaResponse<IOriginalPixelCluster>): void {
    const isSuccess:     boolean  = data.status === CCommon.ON_SUCCESS;
    const isRightPlayer: boolean  = data.username === sessionStorage.getItem(CClient.USERNAME_KEY);
    if (isSuccess && data.response) {
      (isRightPlayer) ? this.playSuccessSound() : this.playOpponentSound();
      data.response.cluster.forEach((pixel: IReplacementPixel) => {
        this.canvasModified.fillStyle = "rgb(" + pixel.color.R + ", " + pixel.color.G + ", " + pixel.color.B + ")";
        this.canvasModified.fillRect(pixel.position.x, pixel.position.y, 1, 1);
      });
    }
  }

  public playMusic(): void {
    this.music.nativeElement.currentTime = 0;
    this.music.nativeElement.play();
  }

  public stopMusic(): void {
    this.music.nativeElement.currentTime = 0;
    this.music.nativeElement.pause();
  }

  public playFailSound(): void {
    this.failSound.nativeElement.currentTime = START_TIME;
    this.failSound.nativeElement.play();
  }

  public playWinSound(): void {
    this.winSound.nativeElement.currentTime = START_TIME;
    this.winSound.nativeElement.play();
  }

  public playLossSound(): void {
    this.lossSound.nativeElement.currentTime = START_TIME;
    this.lossSound.nativeElement.play();
  }

  private playSuccessSound(): void {
    this.successSound.nativeElement.currentTime = START_TIME;
    this.successSound.nativeElement.play();
  }

  private playOpponentSound(): void {
    this.opponentSound.nativeElement.currentTime = START_TIME;
    this.opponentSound.nativeElement.play();
  }

  public setCanvas(modified: CanvasRenderingContext2D): void {
    this.canvasModified = modified;
  }

  public setSounds(
                    success: ElementRef, fail: ElementRef, opponentSound: ElementRef,
                    gameWon: ElementRef, gameLost: ElementRef, music: ElementRef): void {
    this.successSound   = success;
    this.failSound      = fail;
    this.opponentSound  = opponentSound;
    this.winSound       = gameWon;
    this.lossSound      = gameLost;
    this.music          = music;
  }

  public onCanvasClick(pos: IPosition2D, id: number, username: string): IClickMessage<IPosition2D> {

    return {
      value:        pos,
      arenaID:      id,
      username:     username,
    };
  }
}
