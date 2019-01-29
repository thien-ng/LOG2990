import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import { ErrorStateMatcher, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { Constants } from "../constants";
import { SocketService } from "../socket.service";

import { Message } from "../../../../common/communication/message";

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

  public _matcher: MyErrorStateMatcher = new MyErrorStateMatcher();

  public usernameFormControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(Constants.REGEX_PATTERN),
    Validators.minLength(Constants.MIN_LENGTH),
    Validators.maxLength(Constants.MAX_LENGTH),
  ]);

  public constructor(
    private _router: Router,
    private _snackbar: MatSnackBar,
    private _httpClient: HttpClient,
    private _socketService: SocketService,
    ) {
    // default constructor
  }

  public async addUsername(): Promise<void> {
    const message: Message = {
      title: "new username",
      body: this.usernameFormControl.value,
    };
    if (this._socketService != null) {
      const result: Object = await this._httpClient.post(Constants.PATH_TO_LOGIN_VALIDATION, message).toPromise();
      if (result) {
        this._router.navigate([Constants.ROUTER_LOGIN]).catch();
      } else {
        this.displayUnvalidResponse();
      }
    }
  }


  // public addUsername(): void {
  //   if (this.usernameFormControl.errors == null) {
      // this._socketService.sendMsg(Constants.LOGIN_REQUEST, this.usernameFormControl.value);
      // this._socketService.onMsg(Constants.LOGIN_RESPONSE).subscribe((data: String) => {
      //   if (data === Constants.NAME_VALID_VALUE) {
      //     this._router.navigate([Constants.ROUTER_LOGIN]).catch();
      //   } else {
      //     this.displayUnvalidResponse();
      //   }
      // });
  //   }
  // }

  private displayUnvalidResponse(): void {
    this._snackbar.open(
      Constants.SNACKBAR_USED_NAME,
      Constants.SNACKBAR_ATTENTION,
      {duration: Constants.SNACKBAR_DURATION});
  }

}
