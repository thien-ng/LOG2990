import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as io from "socket.io-client";
import { IPlayerInputResponse } from "../../../../common/communication/iGameplay";
import { Constants } from "../constants";
import { ChatViewService } from "../game-view/chat-view/chat-view.service";
import { GameViewSimpleService } from "../game-view/game-view-simple/game-view-simple.service";

@Injectable({
  providedIn: "root",
})
export class SocketService {

  private socket: SocketIOClient.Socket = io(Constants.WEBSOCKET_URL);

  public constructor(
    private chatViewService: ChatViewService,
    private gameViewSimpleService: GameViewSimpleService,
    ) {}

  public initWebsocketListener(): void {

    this.socket.addEventListener(Constants.ON_CONNECT, () => {

      this.socket.on(Constants.ON_ARENA_RESPONSE, (data: IPlayerInputResponse) => {
        this.chatViewService.updateConversation(data);
        this.gameViewSimpleService.isSuccessMessage(data);
      });
      this.socket.on("test", (data: string) => {
        console.log(data);
      })
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
