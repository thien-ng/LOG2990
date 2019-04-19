import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import * as io from "socket.io-client";
import { GameMode, ILobbyEvent } from "../../../../common/communication/iCard";
import { IChat } from "../../../../common/communication/iChat";
import { IArenaResponse, INewScore, IOriginalPixelCluster, ISceneObjectUpdate } from "../../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../../common/communication/iSceneObject";
import { CCommon } from "../../../../common/constantes/cCommon";
import { CClient } from "../CClient";
import { CardManagerService } from "../card/card-manager.service";
import { GameConnectionService } from "../game-connection.service";
import { ChatViewService } from "../game-view/chat-view/chat-view.service";
import { DifferenceCounterService } from "../game-view/difference-counter/difference-counter.service";
import { GameViewFreeService } from "../game-view/game-view-free/game-view-free.service";
import { GameViewSimpleService } from "../game-view/game-view-simple/game-view-simple.service";
import { TimerService } from "../game-view/timer/timer.service";

const GAME_LOAD_ERROR: string = "Erreur lors du chargement du jeu";

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
      this.socket = io(CClient.WEBSOCKET_URL);
      this.gameViewFreeService.setGameSocket(this.socket);
    }

  public initWebsocketListener(): void {

    this.socket.addEventListener(CClient.ON_CONNECT, () => {
      this.initArenaListeners();
      this.initGameViewListeners();
      this.initCardListeners();

      this.socket.on(CCommon.ON_CANCEL_GAME, () => {
        this.router.navigate([CClient.GAMELIST_REDIRECT])
        .catch((error: TypeError) => this.openSnackbar(error.message, CClient.SNACK_ACTION));
        this.openSnackbar(GAME_LOAD_ERROR, CClient.SNACK_ACTION);
      });

      this.socket.on(CCommon.CHAT_EVENT, (data: IChat) => {
        this.chatViewService.updateConversation(data);
      });

      this.socket.on(CCommon.ON_LOBBY, (lobbyEvent: ILobbyEvent) => {
        this.cardManagerService.reloadButton(lobbyEvent);
      });

      this.socket.on(CCommon.ON_CANCEL_REQUEST, () => {
        this.openSnackbar(CClient.CARD_DELETED_MESSAGE, CClient.SNACKBAR_ACKNOWLEDGE);
        this.router.navigate([CClient.GAMELIST_REDIRECT])
        .catch((error: TypeError) => this.openSnackbar(error.message, CClient.SNACK_ACTION));
      });
    });
  }

  private initCardListeners(): void {
    this.socket.on(CCommon.ON_CARD_CREATED, () => {
      this.cardManagerService.updateCards(true);
    });

    this.socket.on(CCommon.ON_CARD_DELETED, () => {
      this.cardManagerService.updateCards(true);
    });

    this.socket.on(CCommon.ON_NEW_SCORE, (gameID: number) => {
      this.cardManagerService.reloadHighscore(gameID);
    });
  }

  private initArenaListeners(): void {
    this.socket.on(CCommon.ON_TIMER_UPDATE, (data: number) => {
      this.timerService.timeFormat(data);
    });

    this.socket.on(CCommon.ON_POINT_ADDED, (newPoints: INewScore) => {
      this.differenceCounterService.updateCounter(newPoints);
    });

    this.socket.on(CCommon.ON_ARENA_CONNECT, (arenaID: number) => {
      this.gameConnectionService.updateGameConnected(arenaID);
    });
  }

  private initGameViewListeners(): void {

    this.socket.on(CCommon.ON_ARENA_RESPONSE, (data: IArenaResponse<IOriginalPixelCluster | ISceneObjectUpdate<ISceneObject | IMesh>>) => {
      this.emitOnArenaResponse(data);
    });
  }

  private emitOnArenaResponse(arenaResponse: IArenaResponse<IOriginalPixelCluster | ISceneObjectUpdate<ISceneObject | IMesh>>): void {
    (arenaResponse.arenaType === GameMode.simple) ?
    this.gameViewSimpleService.onArenaResponse(arenaResponse as IArenaResponse<IOriginalPixelCluster>) :
    this.gameViewFreeService.onArenaResponse(arenaResponse as IArenaResponse<ISceneObjectUpdate<ISceneObject | IMesh>>);
  }

  public sendMessage<T>(type: string, msg?: T): void {
    this.socket.emit(type, msg);
  }

  public onMessage<T>(msgType: string): Observable<T> {
    return new Observable<T> ((observer) => {
      this.socket.on(msgType, (data: T) => {
        observer.next(data);
      });
    });
  }

  private openSnackbar(message: string, action: string): void {
    this.snackBar.open( message, action, {
      duration:           CClient.SNACKBAR_DURATION,
      verticalPosition:   "top",
      panelClass:         ["snackbar"],
    });
  }
}
