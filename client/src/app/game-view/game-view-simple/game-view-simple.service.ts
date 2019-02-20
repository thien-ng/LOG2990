import { Inject, Injectable } from "@angular/core";
import { ICanvasPosition, IClickMessage } from "../../../../../common/communication/iGameplay";
import { Constants } from "../../constants";
import { SocketService } from "../../websocket/socket.service";

@Injectable({
  providedIn: "root",
})

export class GameViewSimpleService {

  public constructor(@Inject(SocketService) private socketService: SocketService) {}

  public onCanvasClick(pos: ICanvasPosition, id: number, username: string): void {
    const clickMessage: IClickMessage = {
      position: pos,
      arenaID: id,
      username: username,
    };
    this.sendMessage(clickMessage);
  }

  private sendMessage(positionMessage: IClickMessage): void {
    this.socketService.sendMsg(Constants.ON_POSITION_VALIDATION, positionMessage);
  }

}
