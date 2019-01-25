import { Injectable } from "@angular/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import { ErrorStateMatcher, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import * as io from 'socket.io-client';
import { Constants } from "../constants";

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

  public _usernameFormControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(Constants.REGEX_PATTERN),
    Validators.minLength(Constants.MIN_LENGTH),
    Validators.maxLength(Constants.MAX_LENGTH),
  ]);

  private _socket : any;

  constructor(private _router: Router, private _snackbar: MatSnackBar) {
    // default constructor
  }

  public addUsername(): void {
    this._socket = io(Constants.WEBSOCKET_URL.toString());
    if (this._usernameFormControl.errors == null){

      this._socket.emit(Constants.LOGIN_REQUEST, this._usernameFormControl.value);
      this._socket.on(Constants.LOGIN_RESPONSE, (data: String) =>{

        if(data == Constants.NAME_VALID_VALUE){
          this._router.navigate([Constants.ROUTER_LOGIN]);
        } else {
          this._snackbar.open(
            Constants.SNACKBAR_USED_NAME,
            Constants.SNACKBAR_ATTENTION,
            {duration: Constants.SNACKBAR_DURATION});
        }
      });
    }
  }

}
