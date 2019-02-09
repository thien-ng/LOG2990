import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as io from "socket.io-client";
import { Constants } from "../constants";
import { IChat } from "../../../../common/communication/iChat";
import { ChatViewService } from "../game-view/chat-view/chat-view.service";

@Injectable({
  providedIn: "root",
})
export class SocketService {
  private socket: SocketIOClient.Socket = io(Constants.WEBSOCKET_URL);

  constructor(private chatViewService: ChatViewService){
    this.createWebsocket();
  }

  public createWebsocket(): void {

    this.socket.addEventListener(Constants.ON_CONNECT, () => {
      this.socket.on(Constants.ON_CHAT_MESSAGE, (data: IChat) => {
        console.log(data);
        this.chatViewService.recoverConversation(data);
      });
    });
  }

  // T is the message type you send
  public sendMsg<T>(type: string, msg: T): void {
    this.socket.emit(type, msg);
  }

  // T is the message type you receive
  public onMsg<T>(msgType: string): Observable<T> {
    return new Observable<T> ((observer) => {
      this.socket.on(msgType, (data: T) => {
        observer.next(data);
      });
    });
  }
}
