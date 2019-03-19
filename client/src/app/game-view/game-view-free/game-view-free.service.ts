import { ElementRef, Injectable } from "@angular/core";
import { GameConnectionService } from "src/app/game-connection.service";
import { IArenaResponse, ISceneObjectUpdate } from "../../../../../common/communication/iGameplay";
import { CCommon } from "../../../../../common/constantes/cCommon";

@Injectable({
  providedIn: "root",
})
export class GameViewFreeService {

  private successSound: ElementRef;
  private failSound:    ElementRef;

  public constructor (private gameConnectionService: GameConnectionService) {}

  public onArenaResponse(data: IArenaResponse<ISceneObjectUpdate>): void {

    if (data.status === CCommon.ON_SUCCESS) {

      this.playSuccessSound();
      if (data.response) {
        this.gameConnectionService.updateModifiedScene(data.response);
      }
    }

  }

  public wrongClickRoutine(): void {
    this.playFailSound();
  }

  public enableClickRoutine(): void {
    // _TODO
  }

  private playFailSound(): void {
    this.failSound.nativeElement.currentTime = 0;
    this.failSound.nativeElement.play();
  }

  private playSuccessSound(): void {
    this.successSound.nativeElement.currentTime = 0;
    this.successSound.nativeElement.play();
  }

  public setSounds(success: ElementRef, fail: ElementRef): void {
    this.successSound = success;
    this.failSound    = fail;
  }

}
