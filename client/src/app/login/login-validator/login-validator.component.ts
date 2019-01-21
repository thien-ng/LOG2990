import { Component } from "@angular/core";
import { LoginValidatorService } from "../login-validator.service";

@Component({
  selector: "app-login-validator",
  templateUrl: "./login-validator.component.html",
  styleUrls: ["./login-validator.component.css"],
})
export class LoginValidatorComponent {

  public constructor(private _loginValidatorService: LoginValidatorService) {
    if (this._loginValidatorService) {
      // a changer
    }
  }

  // public addUsername(): void {
  //   this._loginValidatorService.addUsername();
  // }
}
