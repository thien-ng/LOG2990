import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as io from "socket.io-client";
// import { IChat } from "../../../../common/communication/iChat";
import { IPlayerInputReponse } from "../../../../common/communication/iGameplay";
import { Constants } from "../constants";
import { ChatViewService } from "../game-view/chat-view/chat-view.service";

@Injectable({
  providedIn: "root",
})
export class SocketService {

  private socket: SocketIOClient.Socket = io(Constants.WEBSOCKET_URL);

  public constructor(private chatViewService: ChatViewService) {
  }

  public initWebsocketListener(): void {

    this.socket.addEventListener(Constants.ON_CONNECT, () => {

      this.socket.on(Constants.ON_ARENA_RESPONSE, (data: IPlayerInputReponse) => {
        this.chatViewService.updateConversation(data);
      });

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
