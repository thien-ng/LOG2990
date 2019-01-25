import { Injectable } from '@angular/core';

import { Observable } from "rxjs/Observable";
import * as Rx from "rxjs/Rx";
import { environment } from "../environments/environment";
import { R3ExpressionFactoryMetadata } from '@angular/compiler/src/render3/r3_factory';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private _socket;  //socket that connects to out socket.io server

  constructor() { }

  public connect(): Rx.Subject<MessageEvent>{
    this._socket = io(environment.ws_url);

    let observable = new Observable(observer => {
      this._socket.on("message", (data) => {
        console.log("received a message from websocket server");
        observer.next(data);
      })
      return () => {
        this._socket.disconnect();
      }
    })

    let observer = {
        next: (data: Object) => {
          this._socket.emit("message", JSON.stringify(data));
        },
    };

    return Rx.Subject.create(observer, observable);

  }
}
