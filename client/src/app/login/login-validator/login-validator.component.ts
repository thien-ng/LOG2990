import { Component } from "@angular/core";
import { LoginValidatorService } from "../login-validator.service";
import { Constants } from "../../constants";

@Component({
  selector: "app-login-validator",
  templateUrl: "./login-validator.component.html",
  styleUrls: ["./login-validator.component.css"],
})
export class LoginValidatorComponent {

  public _textHINTUSERNAME: string = "Nom d'utilisateur";
  public _textHINT: string = "Veuillez entrer un alias";
  public _textERRORPATTERN: string = "Caractères autorisés: A-Z, a-z, 0-9";
  public _textERRORSIZE: string = "Taille: "
                                  + this.getUsernameMinLength() + "-"
                                  + this.getUsernameMaxLength() + " caractères";
  public _textERRORREQUIRED: string = "Nom d'utilisateur requis";
  public _textBUTTONSUBMIT: string = "Soumettre";

  public constructor(private _loginValidatorService: LoginValidatorService) {}

  public addUsername(username: string): void {
    this._loginValidatorService.addUsername();
  }

  public hasErrorOfType(errorType: string): boolean {
    return this._loginValidatorService._usernameFormControl.hasError(errorType);
  }

  public hasFormControlErrors(): boolean {
    return !(this._loginValidatorService._usernameFormControl.errors == null);
  }

  public getUsernameMinLength(): number {
    return Constants.MIN_LENGTH;
  }

  public getUsernameMaxLength(): number {
    return Constants.MAX_LENGTH;
  }

  public getUsernameRegex(): string {
    return Constants.REGEX_PATTERN;
  }

}
