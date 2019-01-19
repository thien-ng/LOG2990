import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-highscore-display",
  templateUrl: "./highscore-display.component.html",
  styleUrls: ["./highscore-display.component.css"],
})
export class HighscoreDisplayComponent implements OnInit {

  @Input() public _isExpanded: boolean = false;

  public constructor() {
    // default constructor
  }

  public ngOnInit(): void {
    // default init
  }

}
