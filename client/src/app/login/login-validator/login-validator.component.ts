import { Component } from "@angular/core";
import { LoginValidatorService } from "../login-validator.service";

@Component({
  selector: "app-login-validator",
  templateUrl: "./login-validator.component.html",
  styleUrls: ["./login-validator.component.css"],
})
export class LoginValidatorComponent {

  public constructor(private _loginValidatorService: LoginValidatorService) {}

  public addUsername(): void {
    this._loginValidatorService.addUsername();
  }

  public hasErrorOfType(errorType: string): boolean {
    return this._loginValidatorService.usernameFormControl.hasError(errorType);
  }

  public hasFormControlErrors(): boolean {
    return !(this._loginValidatorService.usernameFormControl.errors == null);
  }
}
