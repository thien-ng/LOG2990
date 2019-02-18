import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Constants } from "src/app/constants";
import { GameMode, ICard } from "../../../../../common/communication/iCard";
import { GameType, IGameRequest } from "../../../../../common/communication/iGameRequest";
import { ISceneVariables } from "../../../../../common/communication/iSceneVariables";
// import { Message } from "../../../../../common/communication/message";

@Component({
  selector: "app-game-view-free",
  templateUrl: "./game-view-free.component.html",
  styleUrls: ["./game-view-free.component.css"],
})
export class GameViewFreeComponent implements OnInit {

  public readonly NEEDED_SNAPSHOT: boolean = false;
  public iSceneVariables: ISceneVariables;
  public activeCard: ICard;
  private gameType: GameType;
  public gameRequest: IGameRequest;
  public cardLoaded: boolean;

  public constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    ) {
      this.cardLoaded = false;
    }

  public ngOnInit(): void {
      const gameID: string | null = this.route.snapshot.paramMap.get("id");
      const username: string | null = sessionStorage.getItem(Constants.USERNAME_KEY);
      if (gameID !== null) {
        this.httpClient.get(Constants.PATH_TO_GET_CARD + gameID + "/" + GameMode.free).subscribe((response: ICard) => {
          this.activeCard = response;
          this.cardLoaded = true;

          const type: string | null = this.route.snapshot.paramMap.get("gamemode");
          if (type !== null && username !== null) {
            this.gameType = JSON.parse(type);
            this.gameRequest = {
              username: username,
              gameId: this.activeCard.gameID,
              type: this.gameType,
              mode: GameMode.free,
            };
          }
        });
      }
  }
}
