import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-spinner",
  templateUrl: "./spinner.component.html",
  styleUrls: ["./spinner.component.scss"],
})
export class SpinnerComponent implements OnInit {

  public constructor() {
    //
  }

  public ngOnInit(): void {
    console.log("init du spinner");
  }

}
