import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import { ErrorStateMatcher, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import "rxjs/add/operator/toPromise";
import { Message } from "../../../../common/communication/message";

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

  public usernameFormControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(Constants.REGEX_PATTERN),
    Validators.minLength(Constants.MIN_LENGTH),
    Validators.maxLength(Constants.MAX_LENGTH),
  ]);

  public constructor(
    private router: Router,
    private snackbar: MatSnackBar,
    private httpClient: HttpClient,
    private socketService: SocketService,
    ) {
      // Default constructor
    }

  public async addUsername(): Promise<void> {

    const message: Message = this.generateMessage(this.usernameFormControl.value);

    if (this.socketService !== undefined && !this.hasErrors()) {
      const result: Object = await this.httpClient.post(Constants.PATH_TO_LOGIN_VALIDATION, message).toPromise();
      if (result) {
        this.navigateLoginSuccessful();
      } else {
        this.displayNameNotUniqueMessage(message.body);
      }
    }
  }

  // Helpers
  public displaySnackBar(message: string, closeStatement: string): void {
    this.snackbar.open(
      message,
      closeStatement,
      {duration: Constants.SNACKBAR_DURATION});
  }

  private hasErrors(): boolean {
    return this.usernameFormControl.errors !== null;
  }

  private generateMessage(username: string): Message {
    return {
      title: Constants.LOGIN_MESSAGE_TITLE,
      body: this.usernameFormControl.value,
    };
  }

  private navigateLoginSuccessful(): void {
    this.router.navigate([Constants.ROUTER_LOGIN]).catch();
    this.displaySnackBar(Constants.SNACKBAR_GREETINGS + this.usernameFormControl.value, Constants.SNACKBAR_ACKNOWLEDGE);
  }

  private displayNameNotUniqueMessage(username: string): void {
    this.displaySnackBar(username + Constants.SNACKBAR_USED_NAME, Constants.SNACKBAR_ATTENTION);
  }
}
