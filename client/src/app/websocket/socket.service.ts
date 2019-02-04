import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as io from "socket.io-client";
import { Constants } from "../constants";

@Injectable({
  providedIn: "root",
})
export class SocketService {
  private socket: SocketIOClient.Socket = io(Constants.WEBSOCKET_URL);

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
