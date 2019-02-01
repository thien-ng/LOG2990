import { Component, Input, OnDestroy, OnInit } from "@angular/core";

import { Subscription } from "rxjs";
import { HighscoreMessage } from "../../../../common/communication/highscore";
import { Constants } from "../constants";
import { HighscoreService } from "./highscore.service";

@Component({
  selector: "app-highscore-display",
  templateUrl: "./highscore-display.component.html",
  styleUrls: ["./highscore-display.component.css"],
})
export class HighscoreDisplayComponent implements OnInit , OnDestroy {

  @Input() public isExpanded: boolean = false;

  public IMAGE_MEDAL_URL: string[] = [
    Constants.PATH_TO_ICONS + "/gold.png",    // gold medal image
    Constants.PATH_TO_ICONS + "/silver.png",  // silver medal image
    Constants.PATH_TO_ICONS + "/bronze.png",  // bronze medal image
  ];
  public highscore: HighscoreMessage;
  public isLoaded: boolean = false;

  public readonly SIMPLE: string = "Simple";
  public readonly ONE_VS_ONE: string = "1 vs 1";
  public readonly RANKING: string = "- Classement -";
  private highscoreSubscription: Subscription;

  public constructor(private highscoreService: HighscoreService) {
    // Default constructor
  }

  public ngOnInit(): void {
    this.highscoreSubscription = this.highscoreService.getHighscoreUpdateListener()
      .subscribe((highscoreValue: HighscoreMessage) => {
        this.highscore = highscoreValue;
        this.isLoaded = true;
      });

  }

  public ngOnDestroy(): void {
    this.highscoreSubscription.unsubscribe();
  }

}
