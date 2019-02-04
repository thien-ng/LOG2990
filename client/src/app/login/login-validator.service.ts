import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material";
import { Router } from "@angular/router";
import "rxjs/add/operator/toPromise";
import { Message } from "../../../../common/communication/message";

import { Observable, Subject } from "rxjs";
import { Constants } from "../constants";
import { SocketService } from "../socket.service";

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

  public async addUsername(): Promise<boolean> {
    if (this.usernameFormControl.errors === null) {
      const message: Message = this.generateMessage(this.usernameFormControl.value);

      const result: Boolean = await this.sendUsernameRequest(message).catch(() => Constants.OBLIGATORY_CATCH);

      if (result) {
        this.socketService.sendMsg(Constants.LOGIN_REQUEST, this.usernameFormControl.value);
        await this.router.navigate([Constants.ROUTER_LOGIN]);
        localStorage.setItem(Constants.USERNAME_KEY, this.usernameFormControl.value);
        this.userNameUpdated.next(localStorage.getItem(Constants.USERNAME_KEY));

        return true;
      }
    }

    return false;
  }

  public getUserNameListener(): Observable<string | null> {
    return this.userNameUpdated;
  }

  // Helpers
  private async sendUsernameRequest(message: Message): Promise<Boolean> {
    return this.httpClient.post<Boolean>(Constants.PATH_TO_LOGIN_VALIDATION, message).toPromise();
  }

  private generateMessage(username: string): Message {
    return {
      title: Constants.LOGIN_MESSAGE_TITLE,
      body: this.usernameFormControl.value,
    };
  }
}
