import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as io from "socket.io-client";
import { IChat } from "../../../../common/communication/iChat";
import { ISceneVariables } from "../../../../common/communication/iSceneVariables";
import { Constants } from "../constants";
import { ChatViewService } from "../game-view/chat-view/chat-view.service";
import { ThreejsViewService } from "../game-view/game-view-free/threejs-view/threejs-view.service";

@Injectable({
  providedIn: "root",
})
export class SocketService {

  private socket: SocketIOClient.Socket = io(Constants.WEBSOCKET_URL);

  public constructor(
    private chatViewService: ChatViewService,
    private threejsViewService: ThreejsViewService) {

    this.initWebsocketListener();
  }

  public initWebsocketListener(): void {

    this.socket.addEventListener(Constants.ON_CONNECT, () => {

      this.socket.on(Constants.ON_CHAT_MESSAGE, (data: IChat) => {
        this.chatViewService.updateConversation(data);
      });

      this.socket.on(Constants.ON_GAME_FREE_DATA, (data: ISceneVariables) => {
        this.threejsViewService.updateSceneVariable(data);
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
