import { Component, Inject } from "@angular/core";
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
                                  + Constants.MIN_LENGTH + "-"
                                  + Constants.MAX_LENGTH + " caractères";
  public ERROR_REQUIRED: string = "Nom d'utilisateur requis";
  public BUTTON_SUBMIT: string = "Soumettre";

  public constructor(@Inject(LoginValidatorService)public loginValidatorService: LoginValidatorService) {}

}
