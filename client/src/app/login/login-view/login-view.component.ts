import { Component } from "@angular/core";
import { Constants } from "../../constants";

@Component({
  selector: "app-login-view",
  templateUrl: "./login-view.component.html",
  styleUrls: ["./login-view.component.css"],
})
export class LoginViewComponent {

  public LOGO_URL: string = Constants.BASE_URL + Constants.PATH_TO_IMAGES + "/logo.png";

}
