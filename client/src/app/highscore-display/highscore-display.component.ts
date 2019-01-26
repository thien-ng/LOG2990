import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-highscore-display",
  templateUrl: "./highscore-display.component.html",
  styleUrls: ["./highscore-display.component.css"],
})
export class HighscoreDisplayComponent implements OnInit {

  @Input() public _isExpanded: boolean = false;

  public _imageMedalsUrl: string[] = [
    "http://localhost:3000/api/asset/icon/gold.png",    // gold medal image
    "http://localhost:3000/api/asset/icon/silver.png",  // silver medal image
    "http://localhost:3000/api/asset/icon/bronze.png",  // bronze medal image
  ];
  public _2DHighscores: string[] = ["1:45", "2:03", "2:30"];
  public _3DHighscores: string[] = ["2:45", "3:11", "4:55"];

  public _textSimple: string = "Simple";
  public _text1vs1: string = "1 vs 1";
  public _textClassement: string = "- Classement -";

  public constructor() {
    // default constructor
  }

  public ngOnInit(): void {
    // default init
  }

}
