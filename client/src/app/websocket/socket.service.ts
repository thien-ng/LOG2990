import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as io from "socket.io-client";
import { GameMode } from "../../../../common/communication/iCard";
import { IChat } from "../../../../common/communication/iChat";
import { IArenaResponse } from "../../../../common/communication/iGameplay";
import { CCommon } from "../../../../common/constantes/cCommon";
import { Constants } from "../constants";
import { GameConnectionService } from "../game-connection.service";
import { ChatViewService } from "../game-view/chat-view/chat-view.service";
import { DifferenceCounterService } from "../game-view/difference-counter/difference-counter.service";
import { GameViewSimpleService } from "../game-view/game-view-simple/game-view-simple.service";
import { TimerService } from "../game-view/timer/timer.service";
import { GameViewFreeService } from "../game-view/game-view-free/game-view-free.service";

@Injectable({
  providedIn: "root",
})
export class SocketService {

  private socket: SocketIOClient.Socket;

  public constructor(
    private chatViewService:          ChatViewService,
    private gameViewSimpleService:    GameViewSimpleService,
    private gameViewFreeService:      GameViewFreeService,
    private timerService:             TimerService,
    private differenceCounterService: DifferenceCounterService,
    private gameConnectionService:    GameConnectionService,
    ) {
      this.socket = io(Constants.WEBSOCKET_URL);
    }

  public initWebsocketListener(): void {

    this.socket.addEventListener(Constants.ON_CONNECT, () => {

      this.checkOnGameViewEmit();

      this.socket.on(CCommon.CHAT_EVENT, (data: IChat) => {
        this.chatViewService.updateConversation(data);
      });

      this.socket.on(CCommon.ON_TIMER_UPDATE, (data: number) => {
        this.timerService.timeFormat(data);
      });

      this.socket.on(CCommon.ON_POINT_ADDED, ((newPoints: number) => {
        this.differenceCounterService.updateCounter(newPoints);
      }));

      this.socket.on(CCommon.ON_ARENA_CONNECT, ((arenaID: number) => {
        this.gameConnectionService.updateGameConnected(arenaID);
      }));
    });
  }
  private checkOnGameViewEmit(): void {
    // tslint:disable-next-line:no-any _TODO
    this.socket.on(CCommon.ON_ARENA_RESPONSE, (data: IArenaResponse<any>) => {
      this.emitOnArenaResponse(data);
    });
    // tslint:disable-next-line:no-any _TODO
    this.socket.on(CCommon.ON_PENALTY_ON, (data: IArenaResponse<any>) => {
      this.emitOnPenaltyOn(data);
    });
    // tslint:disable-next-line:no-any _TODO
    this.socket.on(CCommon.ON_PENALTY_OFF, (data: IArenaResponse<any>) => {
      this.emitOnPenaltyOff(data);
    });
  }

  // tslint:disable-next-line:no-any _TODO
  private emitOnArenaResponse(arenaResponse: IArenaResponse<any>): void {

    if (arenaResponse.arenaType === GameMode.simple) {
      this.gameViewSimpleService.onArenaResponse(arenaResponse);
    } else {
      this.gameViewFreeService.onArenaResponse(arenaResponse);
    }
  }

  private emitOnPenaltyOn(arenaResponse: IArenaResponse<any>): void {

    this.gameViewSimpleService.wrongClickRoutine();
    // if (arenaResponse.arenaType === GameMode.simple) {
    //   this.gameViewSimpleService.wrongClickRoutine();
    // } else {
    //   this.gameViewFreeService.wrongClickRoutine();
    // }
  }

  private emitOnPenaltyOff(arenaResponse: IArenaResponse<any>): void {

    this.gameViewSimpleService.enableClickRoutine();
    // if (arenaResponse.arenaType === GameMode.simple) {
    //   this.gameViewSimpleService.enableClickRoutine();
    // } else {
    //   this.gameViewFreeService.enableClickRoutine();
    // }
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
