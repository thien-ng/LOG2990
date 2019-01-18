import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-login-view",
  templateUrl: "./login-view.component.html",
  styleUrls: ["./login-view.component.css"],
})
export class LoginViewComponent implements OnInit {

  private LOGO: string = require("../../assets/images/logo.png");

  public constructor() {
    // default constructor
  }

  public ngOnInit(): void {
    // default ngOnInit
  }

}
