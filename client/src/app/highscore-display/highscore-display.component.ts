import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-highscore-display",
  templateUrl: "./highscore-display.component.html",
  styleUrls: ["./highscore-display.component.css"],
})
export class HighscoreDisplayComponent implements OnInit {

  @Input() public _isExpanded: boolean = false;
  // il va falloir importer les images désirées dans les assets
  public _imageUrlGold: string = "../../assets/gold.png";
  public _imageUrlSilver: string = "../../assets/silver.png";
  public _imageUrlBronze: string = "../../assets/bronze.png";

  public constructor() {
    // default constructor
  }

  public ngOnInit(): void {
    // default init
  }

}
