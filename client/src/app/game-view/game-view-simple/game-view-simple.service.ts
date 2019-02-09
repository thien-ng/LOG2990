import { Inject, Injectable } from "@angular/core";
import { SocketService } from "../../websocket/socket.service";
import { ICanvasPosition } from "../../../../../common/communication/iGameplay";
import { Constants } from "../../constants";

@Injectable({
  providedIn: "root",
})

export class GameViewSimpleService {

  public constructor(@Inject(SocketService) private socketService: SocketService) {
    //default constructor
  }

  public onCanvasClick(xPosition: number, yPosision: number): void {
    const positionMessage: ICanvasPosition = {
      x: xPosition,
      y: yPosision,
    };

    this.socketService.sendMsg(Constants.ON_POSITION_VALIDATION, positionMessage);
  }

}
