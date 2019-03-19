import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import * as io from "socket.io-client";
import { GameMode, ILobbyEvent } from "../../../../common/communication/iCard";
import { IChat } from "../../../../common/communication/iChat";
import { IArenaResponse, IOriginalPixelCluster, ISceneObjectUpdate, IPenalty } from "../../../../common/communication/iGameplay";
import { CCommon } from "../../../../common/constantes/cCommon";
import { CardManagerService } from "../card/card-manager.service";
import { Constants } from "../constants";
import { GameConnectionService } from "../game-connection.service";
import { ChatViewService } from "../game-view/chat-view/chat-view.service";
import { DifferenceCounterService } from "../game-view/difference-counter/difference-counter.service";
import { GameViewFreeService } from "../game-view/game-view-free/game-view-free.service";
import { GameViewSimpleService } from "../game-view/game-view-simple/game-view-simple.service";
import { TimerService } from "../game-view/timer/timer.service";

@Injectable({
  providedIn: "root",
})
export class SocketService {

  private socket: SocketIOClient.Socket;

  public constructor(
    private router:                   Router,
    private snackBar:                 MatSnackBar,
    private cardManagerService:       CardManagerService,
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
      this.initGameViewListeners();
      this.initArenaListeners();

      this.socket.on(CCommon.CHAT_EVENT, (data: IChat) => {
        this.chatViewService.updateConversation(data);
      });

      this.socket.on(CCommon.ON_NEW_SCORE, (gameID: number) => {
        this.cardManagerService.reloadHighscore(gameID);
      });

      this.socket.on(CCommon.ON_LOBBY, (lobbyEvent: ILobbyEvent) => {
        this.cardManagerService.reloadButton(lobbyEvent);
      });

      this.socket.on(CCommon.ON_CANCEL_REQUEST, () => {
        this.openSnackbar(Constants.CARD_DELETED_MESSAGE, Constants.SNACKBAR_ACKNOWLEDGE);
        this.router.navigate([Constants.GAMELIST_REDIRECT])
        .catch((error: TypeError) => this.openSnackbar(error.message, Constants.SNACK_ACTION));
      });
    });
  }

  private initArenaListeners(): void {
    this.socket.on(CCommon.ON_TIMER_UPDATE, (data: number) => {
      this.timerService.timeFormat(data);
    });

    this.socket.on(CCommon.ON_POINT_ADDED, (newPoints: number) => {
      this.differenceCounterService.updateCounter(newPoints);
    });

    this.socket.on(CCommon.ON_ARENA_CONNECT, (arenaID: number) => {
      this.gameConnectionService.updateGameConnected(arenaID);
    });
  }

  private initGameViewListeners(): void {
    // tslint:disable-next-line:no-any _TODO
    this.socket.on(CCommon.ON_ARENA_RESPONSE, (data: IArenaResponse<any>) => {
      this.emitOnArenaResponse(data);
    });

    this.socket.on(CCommon.ON_PENALTY, (data: IPenalty) => {
      this.emitOnPenaltyOn(data);
    });
  }

  private emitOnArenaResponse(arenaResponse: IArenaResponse<IOriginalPixelCluster | ISceneObjectUpdate>): void {

    if (arenaResponse.arenaType === GameMode.simple) {
      this.gameViewSimpleService.onArenaResponse(arenaResponse as IArenaResponse<IOriginalPixelCluster>);
    } else {
      this.gameViewFreeService.onArenaResponse(arenaResponse as IArenaResponse<ISceneObjectUpdate>);
    }
  }

  // tslint:disable-next-line:no-any _TODO
  private emitOnPenaltyOn(arenaResponse: IPenalty): void {

    if (arenaResponse.isOnPenalty) {
      this.wrongClickRoutine(arenaResponse.arenaType);
    } else {
      this.enableClickRoutine(arenaResponse.arenaType);
    }
  }

  private wrongClickRoutine(arenaType: GameMode): void {
    if (arenaType === GameMode.simple) {
      this.gameViewSimpleService.wrongClickRoutine();
    } else {
      this.gameViewFreeService.wrongClickRoutine();
    }
  }

  private enableClickRoutine(arenaType: GameMode): void {
    if (arenaType === GameMode.simple) {
      this.gameViewSimpleService.enableClickRoutine();
    } else {
      // this.gameViewFreeService.enableClickRoutine();
    }
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

  private openSnackbar(message: string, action: string): void {
    this.snackBar.open( message, action, {
      duration:           Constants.SNACKBAR_DURATION,
      verticalPosition:   "top",
      panelClass:         ["snackbar"],
    });
  }
}
