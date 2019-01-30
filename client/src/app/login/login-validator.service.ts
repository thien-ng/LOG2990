import { Injectable } from "@angular/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import { ErrorStateMatcher, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
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
    private socketService: SocketService,
    ) {
      // Default constructor
    }

  public addUsername(): void {
    if (this.usernameFormControl.errors == null) {

      this.socketService.sendMsg(Constants.LOGIN_REQUEST, this.usernameFormControl.value);
      this.socketService.onMsg(Constants.LOGIN_RESPONSE).subscribe((data: String) => {
        if (data === Constants.NAME_VALID_VALUE) {
          this.router.navigate([Constants.ROUTER_LOGIN]).catch();
        } else {
          this.displayUnvalidResponse();
        }
      });
    }
  }

  private displayUnvalidResponse(): void {
    this.snackbar.open(
      Constants.SNACKBAR_USED_NAME,
      Constants.SNACKBAR_ATTENTION,
      {duration: Constants.SNACKBAR_DURATION});
  }

}
