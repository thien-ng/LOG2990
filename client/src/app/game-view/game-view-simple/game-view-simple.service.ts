import { Injectable } from "@angular/core";
import { IClickMessage, IPlayerInputResponse, IPosition2D } from "../../../../../common/communication/iGameplay";
import { Constants } from "../../constants";

@Injectable({
  providedIn: "root",
})

export class GameViewSimpleService {

  public canvasModified: CanvasRenderingContext2D;

  public constructor() {}

  public verifyServerValidation(data: IPlayerInputResponse): void {
    if (data.status === Constants.ON_SUCCESS_MESSAGE) {
      this.canvasModified.fillStyle = "#FF0000";
      this.canvasModified.fillRect(0, 0, 150, 75);
    }
  }

  public setCanvas(modified: CanvasRenderingContext2D): void {
    this.canvasModified = modified;
  }

  public onCanvasClick(pos: IPosition2D, id: number, username: string): IClickMessage {
    return {
      position: pos,
      arenaID: id,
      username: username,
    };
  }
}
