import { Injectable } from '@angular/core';
import { WebsocketService } from "./websocket.service";
import { Observable, Subject } from "rxjs/Rx";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  messages: Subject<any>;

  public constructor(private _wsService: WebsocketService) {
    this.messages = <Subject<any>>_wsService
      .connect()
      .map((response:any):any => {
        return response;
      })
    }

  public sendMessage(message: Subject<any>): void{
    this.messages.next(message);
  }
}
