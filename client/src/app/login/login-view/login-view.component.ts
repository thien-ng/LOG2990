import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-login-view",
  templateUrl: "./login-view.component.html",
  styleUrls: ["./login-view.component.css"],
})
export class LoginViewComponent implements OnInit {

  public constructor() {
    // default constructor
  }

  private LOGO: string = require("../../../assets/images/logo.png");

  public ngOnInit(): void {
    // default ngOnInit
  }

}
