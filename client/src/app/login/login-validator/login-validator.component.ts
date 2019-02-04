import { Component, Inject } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Constants } from "../../constants";
import { LoginValidatorService } from "../login-validator.service";

@Component({
  selector: "app-login-validator",
  templateUrl: "./login-validator.component.html",
  styleUrls: ["./login-validator.component.css"],
})
export class LoginValidatorComponent {

  public readonly HINT_USERNAME: string = "Nom d'utilisateur";
  public readonly HINT: string = "Veuillez entrer un alias";
  public readonly ERROR_PATTERN: string = "Caractères autorisés: A-Z, a-z, 0-9";
  public readonly ERROR_SIZE: string = "Taille: "
                                  + Constants.MIN_LENGTH + "-"
                                  + Constants.MAX_LENGTH + " caractères";
  public readonly ERROR_REQUIRED: string = "Nom d'utilisateur requis";
  public readonly BUTTON_SUBMIT: string = "Soumettre";

  public constructor(
    @Inject(LoginValidatorService) public loginValidatorService: LoginValidatorService,
    private snackbar: MatSnackBar) {}

  public async addUsername(): Promise<void> {
    const isValid: boolean = await this.loginValidatorService.addUsername();

    if (isValid) {
      this.displayNameIsUnique();
    } else if (this.loginValidatorService.usernameFormControl.errors === null) {
      this.displayNameNotUnique();
    }
  }

  private displaySnackBar(message: string, closeStatement: string): void {
      this.snackbar.open(
        message,
        closeStatement,
        {duration: Constants.SNACKBAR_DURATION});
  }

  private displayNameIsUnique(): void {
    this.displaySnackBar(Constants.SNACKBAR_GREETINGS + this.loginValidatorService.usernameFormControl.value,
                         Constants.SNACKBAR_ACKNOWLEDGE);
  }

  private displayNameNotUnique(): void {
    this.displaySnackBar(this.loginValidatorService.usernameFormControl.value + Constants.SNACKBAR_USED_NAME,
                         Constants.SNACKBAR_ATTENTION);
  }

}
