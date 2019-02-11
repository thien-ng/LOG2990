import { Inject, Injectable } from "@angular/core";
import { ICanvasPosition } from "../../../../../common/communication/iGameplay";
import { Constants } from "../../constants";
import { SocketService } from "../../websocket/socket.service";

@Injectable({
  providedIn: "root",
})

export class GameViewSimpleService {

  public constructor(@Inject(SocketService) private socketService: SocketService) {}

  public onCanvasClick(xPosition: number, yPosision: number): void {
    const positionMessage: ICanvasPosition = {
      x: xPosition,
      y: yPosision,
    };

    this.sendMessage(positionMessage);
  }

  private sendMessage(positionMessage: ICanvasPosition): void {
    this.socketService.sendMsg(Constants.ON_POSITION_VALIDATION, positionMessage);
  }

}
