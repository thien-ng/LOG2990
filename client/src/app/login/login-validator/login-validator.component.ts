import { Component, Inject } from "@angular/core";
import {FormControl, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import { ErrorStateMatcher, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { Message } from "../../../../../common/communication/message";
import { Constants } from "../../constants";
import { SocketService } from "../../websocket/socket.service";
import { LoginValidatorService } from "../login-validator.service";

export class MyErrorStateMatcher implements ErrorStateMatcher {
  public isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted: boolean | null = form && form.submitted;

    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
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
  public matcher: MyErrorStateMatcher;

  public constructor(
    @Inject(LoginValidatorService) public loginValidatorService: LoginValidatorService,
    @Inject(SocketService) private socketService: SocketService,
    private snackbar: MatSnackBar,
    private router: Router,
  ) {
    this.matcher = new MyErrorStateMatcher();
  }

  public usernameFormControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(Constants.REGEX_PATTERN),
    Validators.minLength(Constants.MIN_LENGTH),
    Validators.maxLength(Constants.MAX_LENGTH),
  ]);

  public addUsername(): void {
    if (this.usernameFormControl.errors === null) {
      this.loginValidatorService.addUsername(this.usernameFormControl.value).subscribe(async (response: Message) => {

        if (response.title === "onError") {
          this.displaySnackBar(response.body, Constants.SNACK_ACTION);

          return;
        }

        if (response.body === "true") {
          this.displayNameIsUnique();
          this.socketService.sendMsg(Constants.LOGIN_REQUEST, this.usernameFormControl.value);
          await this.router.navigate([Constants.ROUTER_LOGIN]);
        } else {
          this.displayNameNotUnique();
        }
      });
    }

  }

  private displaySnackBar(message: string, closeStatement: string): void {
      this.snackbar.open(
        message,
        closeStatement,
        {duration: Constants.SNACKBAR_DURATION});
  }

  private displayNameIsUnique(): void {
    this.displaySnackBar(Constants.SNACKBAR_GREETINGS + this.usernameFormControl.value,
                         Constants.SNACKBAR_ACKNOWLEDGE);
  }

  private displayNameNotUnique(): void {
    this.displaySnackBar(this.usernameFormControl.value + Constants.SNACKBAR_USED_NAME,
                         Constants.SNACKBAR_ATTENTION);
  }

}
