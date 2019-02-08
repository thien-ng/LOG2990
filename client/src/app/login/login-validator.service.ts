import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import "rxjs/add/operator/toPromise";
import { Message } from "../../../../common/communication/message";

import { Observable, Subject } from "rxjs";
import { Constants } from "../constants";
@Injectable({
  providedIn: "root",
})

export class LoginValidatorService {

  public userNameUpdated: Subject<string | null> = new Subject<string | null>();

  public constructor(
    private httpClient: HttpClient,
    ) {
      // Default constructor
    }

  public addUsername(username: string): Observable<boolean> {
    const message: Message = this.generateMessage(username);
    localStorage.setItem(Constants.USERNAME_KEY, username);
    this.userNameUpdated.next(localStorage.getItem(Constants.USERNAME_KEY));

    return this.sendUsernameRequest(message);
  }

  public getUserNameListener(): Observable<string | null> {
    return this.userNameUpdated;
  }

  // Helpers
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
