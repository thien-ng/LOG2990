import { Component, Input, OnInit } from "@angular/core";

import { Constants } from "../constants";

@Component({
  selector: "app-highscore-display",
  templateUrl: "./highscore-display.component.html",
  styleUrls: ["./highscore-display.component.css"],
})
export class HighscoreDisplayComponent implements OnInit {

  @Input() public isExpanded: boolean = false;

  public IMAGE_MEDAL_URL: string[] = [
    Constants.PATH_TO_ICONS + "/gold.png",    // gold medal image
    Constants.PATH_TO_ICONS + "/silver.png",  // silver medal image
    Constants.PATH_TO_ICONS + "/bronze.png",  // bronze medal image
  ];
  public HIGHSCORES_2D: string[] = ["1:45", "2:03", "2:30"];
  public HIGHSCORES_3D: string[] = ["2:45", "3:11", "4:55"];

  public SIMPLE: string = "Simple";
  public ONE_VS_ONE: string = "1 vs 1";
  public RANKING: string = "- Classement -";

  public constructor() { /* Default constructor */ }

  public ngOnInit(): void { /* default init */ }

}
