// import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material";

// const HTTP_OPTION  = {
//   headers: new HttpHeaders({
//     "Content-Type":  "application/json",
//     // 'Authorization': 'my-auth-token'
//   }),
// };

const MIN_LENGTH: number = 4;
const MAX_LENGTH: number = 15;
const REGEX_PATTERN: string = "^[a-zA-Z0-9]+$";
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

  // private _configUrl: string = "http://localhost:3000/";

  // public constructor(private _httpClient: HttpClient) { /* default constructor */ }

  private _matcher: MyErrorStateMatcher = new MyErrorStateMatcher();

  public usernames: string[] = [];

  public usernameFormControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(REGEX_PATTERN),
    Validators.minLength(MIN_LENGTH),
    Validators.maxLength(MAX_LENGTH),
  ]);

  public addUsername(): void {
    if (this.usernameFormControl.errors == null && this.checkIfUnique(this.usernameFormControl.value)) {
      this.usernames.push(this.usernameFormControl.value);
    }
  }

  private checkIfUnique(username: string): boolean {
    return !this.usernames.includes(username);
  }

}
