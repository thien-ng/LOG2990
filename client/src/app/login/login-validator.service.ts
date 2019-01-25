import { Injectable } from "@angular/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import { ErrorStateMatcher, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import * as io from 'socket.io-client';

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

  public MIN_LENGTH: number = 4;
  public MAX_LENGTH: number = 15;
  public REGEX_PATTERN: string = "^[a-zA-Z0-9]+$";

  public _matcher: MyErrorStateMatcher = new MyErrorStateMatcher();

  public _usernameFormControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(this.REGEX_PATTERN),
    Validators.minLength(this.MIN_LENGTH),
    Validators.maxLength(this.MAX_LENGTH),
  ]);

  private _socket : any;
  private NAME_EVENT = "onLogin";

  constructor(private _router: Router, private _snackbar: MatSnackBar) {
    // default constructor
  }

  public addUsername(): void {
    this._socket = io("http://localhost:3333");
    if (this._usernameFormControl.errors == null) {
      this._socket.emit(this.NAME_EVENT, this._usernameFormControl.value);
      this._socket.on("loginReponse", (data: String) =>{
        if (data === "true") {
          this._router.navigate(["gamelist"]);
        } else {
          this._snackbar.open("Nom déjà utilisé!", "Attention", {duration: 5000});
        }
      });
    }
  }

}
