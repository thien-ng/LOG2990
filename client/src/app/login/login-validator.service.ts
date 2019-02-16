import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/toPromise";
import { Message } from "../../../../common/communication/message";

import { Observable } from "rxjs";
import { Constants } from "../constants";
@Injectable({
  providedIn: "root",
})

export class LoginValidatorService {

  public constructor(private httpClient: HttpClient) {}

  public addUsername(username: string): Observable<boolean> {
    const message: Message = this.generateMessage(username);

    return this.sendUsernameRequest(message);
  }

  private sendUsernameRequest(message: Message): Observable<boolean> {
    return this.httpClient.post<boolean>(Constants.PATH_TO_LOGIN_VALIDATION, message);
  }

  private generateMessage(username: string): Message {
    return {
      title: Constants.LOGIN_MESSAGE_TITLE,
      body: username,
    };
  }
}
