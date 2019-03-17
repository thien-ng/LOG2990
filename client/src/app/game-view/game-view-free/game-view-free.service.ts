import { Injectable } from "@angular/core";
import { IArenaResponse, ISceneObjectUpdate } from "../../../../../common/communication/iGameplay";
import { CCommon } from "../../../../../common/constantes/cCommon";
import { GameConnectionService } from "src/app/game-connection.service";

@Injectable({
  providedIn: "root",
})
export class GameViewFreeService {

  public constructor (private gameConnectionService: GameConnectionService) {}

  public onArenaResponse(data: IArenaResponse<ISceneObjectUpdate>): void {

    if (data.status === CCommon.ON_ERROR) {
      return;
    }

    // this.playSuccessSound();
    if (data.response) {
      this.gameConnectionService.updateObjectToUpdate(data.response);
    }
  }

  public wrongClickRoutine(): void {
    // _TODO
  }

  public enableClickRoutine(): void {
    // _TODO
  }

}
