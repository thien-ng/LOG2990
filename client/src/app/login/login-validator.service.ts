import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material";
import { Router } from "@angular/router";
import "rxjs/add/operator/toPromise";
import { Message } from "../../../../common/communication/message";

import { Observable, Subject, observable, Subscriber } from "rxjs";
import { Constants } from "../constants";
import { SocketService } from "../websocket/socket.service";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  public isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted: boolean | null = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Injectable({
  providedIn: "root",
})

export class LoginValidatorService {

  public matcher: MyErrorStateMatcher = new MyErrorStateMatcher();
  public userNameUpdated: Subject<string | null> = new Subject<string | null>();

  public usernameFormControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(Constants.REGEX_PATTERN),
    Validators.minLength(Constants.MIN_LENGTH),
    Validators.maxLength(Constants.MAX_LENGTH),
  ]);

  public constructor(
    private router: Router,
    private httpClient: HttpClient,
    private socketService: SocketService,
    ) {
      // Default constructor
    }

  public addUsername(): Observable<boolean> {
    if (this.usernameFormControl.errors === null) {
      const message: Message = this.generateMessage(this.usernameFormControl.value);

      return this.sendUsernameRequest(message);
      // .subscribe(async (result: boolean) => {

      //   if (result) {
      //     this.socketService.sendMsg(Constants.LOGIN_REQUEST, this.usernameFormControl.value);
      //     await this.router.navigate([Constants.ROUTER_LOGIN]);
      //     localStorage.setItem(Constants.USERNAME_KEY, this.usernameFormControl.value);
      //     this.userNameUpdated.next(localStorage.getItem(Constants.USERNAME_KEY));

      //     return true;
      //   }

      //   return false;
      // });

    }

    return new Observable<boolean>((subscriber: Subscriber<boolean>) => subscriber.next(false));
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
      body: this.usernameFormControl.value,
    };
  }
}
