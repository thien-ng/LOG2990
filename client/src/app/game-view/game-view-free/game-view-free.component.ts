import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { Constants } from "src/app/constants";
import { GameMode, ICard } from "../../../../../common/communication/iCard";
import { GameType, IGameRequest } from "../../../../../common/communication/iGameRequest";
import { ISceneVariables } from "../../../../../common/communication/iSceneVariables";
import { Message } from "../../../../../common/communication/message";

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
    private snackBar: MatSnackBar,
    ) {
      this.cardLoaded = false;
    }

  public ngOnInit(): void {
      const gameID: string | null = this.route.snapshot.paramMap.get("id");
      const username: string | null = sessionStorage.getItem(Constants.USERNAME_KEY);
      if (gameID !== null && username !== null){
        this.createGameRequest(gameID, username);
      }
  }

  private createGameRequest(gameID: string, username: string): void {
     this.httpClient.get(Constants.PATH_TO_GET_CARD + gameID + "/" + GameMode.free).subscribe((response: ICard) => {
      this.activeCard = response;
      this.cardLoaded = true;

      const type: string | null = this.route.snapshot.paramMap.get("gamemode");
      if (type !== null) {
        this.getSceneVariables(type, username);
      }
    });

  }

  private getSceneVariables(type: string, username: string): void {
    this.gameType = JSON.parse(type);
    this.gameRequest = {
        username: username,
        gameId: this.activeCard.gameID,
        type: this.gameType,
        mode: GameMode.free,
    };
    this.handleGameRequest();
  }

  private handleGameRequest(): void {
    this.httpClient.post(Constants.GAME_REQUEST_PATH, this.gameRequest).subscribe((data: Message) => {
      fetch(data.body).then((response) => {
        this.loadFileInObject(response)
        .catch((error) => {
          this.openSnackBar(error, Constants.SNACK_ACTION);
        });
      })
      .catch((error) => {
        this.openSnackBar(error, Constants.SNACK_ACTION);
      });
    });
  }

  private async loadFileInObject(response: Response): Promise<void> {
    if (response.status !== Constants.SUCCESS_STATUS) {
      this.openSnackBar(response.statusText, Constants.SNACK_ACTION);
    } else {
      await response.json().then((variables: ISceneVariables) => {
        this.iSceneVariables = {
          gameName: variables.gameName,
          sceneBackgroundColor: variables.sceneBackgroundColor,
          sceneObjects: variables.sceneObjects,
          sceneObjectsQuantity: variables.sceneObjectsQuantity,
        };
      }).catch((error) => {
        this.openSnackBar(error, Constants.SNACK_ACTION);
      });
    }
  }

  private openSnackBar(msg: string, action: string): void {
    this.snackBar.open(msg, action, {
      duration: Constants.SNACKBAR_DURATION,
      verticalPosition: "top",
    });
  }
}
