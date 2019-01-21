import { Injectable } from "@angular/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material";

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

  public _usernames: string[] = [];

  public usernameFormControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(this.REGEX_PATTERN),
    Validators.minLength(this.MIN_LENGTH),
    Validators.maxLength(this.MAX_LENGTH),
  ]);

  public addUsername(): void {
    if (this.usernameFormControl.errors == null && this.checkIfUnique(this.usernameFormControl.value)) {
      this._usernames.push(this.usernameFormControl.value);
    }
  }

  private checkIfUnique(username: string): boolean {
    return !this._usernames.includes(username);
  }

}
