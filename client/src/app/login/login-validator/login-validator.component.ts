import { Component } from "@angular/core";
import { Constants } from "../../constants";
import { LoginValidatorService } from "../login-validator.service";

@Component({
  selector: "app-login-validator",
  templateUrl: "./login-validator.component.html",
  styleUrls: ["./login-validator.component.css"],
})
export class LoginValidatorComponent {

  public HINT_USERNAME: string = "Nom d'utilisateur";
  public HINT: string = "Veuillez entrer un alias";
  public ERROR_PATTERN: string = "Caractères autorisés: A-Z, a-z, 0-9";
  public ERROR_SIZE: string = "Taille: "
                                  + this.usernameMinLength() + "-"
                                  + this.usernameMaxLength() + " caractères";
  public ERROR_REQUIRED: string = "Nom d'utilisateur requis";
  public BUTTON_SUBMIT: string = "Soumettre";

  public constructor(private _loginValidatorService: LoginValidatorService) {}

  public addUsername(username: string): void {
    this._loginValidatorService.addUsername();
  }

  public hasErrorOfType(errorType: string): boolean {
    return this._loginValidatorService.usernameFormControl.hasError(errorType);
  }

  public get hasFormControlErrors(): boolean {
    return !(this._loginValidatorService.usernameFormControl.errors == null);
  }

  public get usernameMinLength(): number {
    return Constants.MIN_LENGTH;
  }

  public get usernameMaxLength(): number {
    return Constants.MAX_LENGTH;
  }

  public get usernameRegex(): string {
    return Constants.GAME_REGEX_PATTERN;
  }

}
