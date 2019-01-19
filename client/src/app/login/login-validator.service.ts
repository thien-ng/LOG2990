import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: "root",
})
export class LoginValidatorService {

  private _configUrl : String = "/";

  public constructor() { /* default constructor */ }

  public addUsername(): void {
    // if (this.usernameFormControl.value) {
    //   this.usernames.push(this.usernameFormControl.value);
    // }
  }

}
