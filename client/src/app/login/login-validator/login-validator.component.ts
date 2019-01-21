import { Component } from "@angular/core";
import { LoginValidatorService } from "../login-validator.service";

@Component({
  selector: "app-login-validator",
  templateUrl: "./login-validator.component.html",
  styleUrls: ["./login-validator.component.css"],
})
export class LoginValidatorComponent {

  public _textHint: string = "Veuillez entrer un alias";
  public _textErrorPattern: string = "Caractères autorisés: A-Z, a-z, 0-9";
  public _textErrorSize: string = "Taille: 4-15 caractères";
  public _textErrorRequired: string = "Nom d'utilisateur <strong>requis</strong>";
  public _textButtonSubmit: string = "Soumettre";

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
