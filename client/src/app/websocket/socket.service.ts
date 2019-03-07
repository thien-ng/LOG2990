import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as io from "socket.io-client";
import { IChat } from "../../../../common/communication/iChat";
import { IPlayerInputResponse } from "../../../../common/communication/iGameplay";
import { CCommon } from "../../../../common/constantes/cCommon";
import { Constants } from "../constants";
import { ChatViewService } from "../game-view/chat-view/chat-view.service";
import { DifferenceCounterService } from "../game-view/difference-counter/difference-counter.service";
import { GameViewSimpleService } from "../game-view/game-view-simple/game-view-simple.service";
import { TimerService } from "../game-view/timer/timer.service";

@Injectable({
  providedIn: "root",
})
export class SocketService {

  private socket: SocketIOClient.Socket;

  public constructor(
    private chatViewService:          ChatViewService,
    private gameViewSimpleService:    GameViewSimpleService,
    private timerService:             TimerService,
    private differenceCounterService: DifferenceCounterService,
    ) {
      this.socket = io(Constants.WEBSOCKET_URL);
    }

  public initWebsocketListener(): void {

    this.socket.addEventListener(Constants.ON_CONNECT, () => {

      this.socket.on(CCommon.ON_ARENA_RESPONSE, (data: IPlayerInputResponse) => {
        this.gameViewSimpleService.onArenaResponse(data);
      });

      this.socket.on(Constants.ON_CHAT_EVENT, (data: IChat) => {
        this.chatViewService.updateConversation(data);
      });

      this.socket.on(CCommon.ON_TIMER_UPDATE, (data: number) => {
        this.timerService.timeFormat(data);
      });

      this.socket.on(CCommon.ON_POINT_ADDED, ((newPoints: number) => {
        this.differenceCounterService.updateCounter(newPoints);
      }));
    });
  }

  public sendMsg<T>(type: string, msg: T): void {
    this.socket.emit(type, msg);
  }

  public onMsg<T>(msgType: string): Observable<T> {
    return new Observable<T> ((observer) => {
      this.socket.on(msgType, (data: T) => {
        observer.next(data);
      });
    });
  }
}
