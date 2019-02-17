import { HttpClient } from "@angular/common/http";
import { AfterContentInit, Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Constants } from "src/app/constants";
import { GameMode, ICard } from "../../../../../common/communication/iCard";
import { ISceneVariables } from "../../../../../common/communication/iSceneVariables";

@Component({
  selector: "app-game-view-free",
  templateUrl: "./game-view-free.component.html",
  styleUrls: ["./game-view-free.component.css"],
})
export class GameViewFreeComponent implements OnInit, AfterContentInit {

  public readonly NEEDED_SNAPSHOT: boolean = false;
  public iSceneVariables: ISceneVariables;
  public activeCard: ICard;
  public cardLoaded: boolean;

  public constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    ) {
      this.cardLoaded = false;
    }

  public ngOnInit(): void {
      const gameID: string | null = this.route.snapshot.paramMap.get("id");
      if (gameID !== null) {
        this.httpClient.get(Constants.PATH_TO_GET_CARD + gameID + "/" + GameMode.free).subscribe((response: ICard) => {
          this.activeCard = response;
          this.cardLoaded = true;
        });
      }
  }

  public ngAfterContentInit(): void {
    this.httpClient.post(Constants.GAME_REQUEST_PATH, "test").subscribe((data: any) => {
    });
  }

}
