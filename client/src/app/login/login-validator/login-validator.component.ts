import { Component } from "@angular/core";
import { LoginValidatorService } from "../login-validator.service";

@Component({
  selector: "app-login-validator",
  templateUrl: "./login-validator.component.html",
  styleUrls: ["./login-validator.component.css"],
})
export class LoginValidatorComponent {

  private _usernames: string[];

  public constructor(private _loginValidatorService: LoginValidatorService) {
    this._usernames = _loginValidatorService.usernames;
  }

  // public addUsername(): void {
  //   this._loginValidatorService.addUsername();
  // }
}
