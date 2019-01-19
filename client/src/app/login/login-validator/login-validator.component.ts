import { Component } from "@angular/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material";

const MIN_LENGTH: number = 4;
const MAX_LENGTH: number = 15;

export class MyErrorStateMatcher implements ErrorStateMatcher {
  public isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted: boolean | null = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: "app-login-validator",
  templateUrl: "./login-validator.component.html",
  styleUrls: ["./login-validator.component.css"],
})
export class LoginValidatorComponent {
  public usernameFormControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern("^[a-zA-Z0-9]+$"),
    Validators.minLength(MIN_LENGTH),
    Validators.maxLength(MAX_LENGTH),
  ]);

  public matcher: MyErrorStateMatcher = new MyErrorStateMatcher();

  public usernames: string[] = [];

  public addUsername(newUsername: string): void {
    if (newUsername) {
      this.usernames.push(newUsername);
    }
  }
}
