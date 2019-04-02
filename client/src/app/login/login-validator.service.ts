import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/toPromise";
import { Message } from "../../../../common/communication/message";

import { Observable } from "rxjs";
import { CClient } from "../CClient";
@Injectable({
  providedIn: "root",
})

export class LoginValidatorService {

  public constructor(private httpClient: HttpClient) {}

  public addUsername(username: string): Observable<Message> {
    const message: Message = this.generateMessage(this.capitalizeFirstLetter(username));

    return this.sendUsernameRequest(message);
  }

  private sendUsernameRequest(message: Message): Observable<Message> {
    return this.httpClient.post<Message>(CClient.PATH_TO_LOGIN_VALIDATION, message);
  }

  public capitalizeFirstLetter(username: string): string {
    return username.charAt(0).toUpperCase() + username.slice(1);
}

  private generateMessage(username: string): Message {
    return {
      title:    CClient.LOGIN_MESSAGE_TITLE,
      body:     username,
    };
  }
}
