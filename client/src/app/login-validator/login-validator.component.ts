import { Component } from "@angular/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material";

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  public isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted: boolean | null = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

/** @title Input with a custom ErrorStateMatcher */
@Component({
  selector: "app-login-validator",
  templateUrl: "./login-validator.component.html",
  styleUrls: ["./login-validator.component.css"],
})
export class LoginValidatorComponent {
  public usernameFormControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.email,
  ]);

  public matcher: MyErrorStateMatcher = new MyErrorStateMatcher();
}
