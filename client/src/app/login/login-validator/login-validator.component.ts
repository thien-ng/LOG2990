import { Component, Input } from "@angular/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material";
import { LoginValidatorService } from "../login-validator.service";

const MIN_LENGTH : number = 4;
const MAX_LENGTH : number = 15;
const REGEX_PATTERN: string = "^[a-zA-Z0-9]+$";

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

  public constructor(private _loginValidatorService : LoginValidatorService){}

  public usernameFormControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(REGEX_PATTERN),
    Validators.minLength(MIN_LENGTH),
    Validators.maxLength(MAX_LENGTH),
  ]);

  public matcher: MyErrorStateMatcher = new MyErrorStateMatcher();

  @Input() public usernames: string[];

  public addUsername(): void {
    // if (this.usernameFormControl.value) {
    //   this.usernames.push(this.usernameFormControl.value);
    //}
    this._loginValidatorService.addUsername();
  }
}
