import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { Constants } from "src/app/constants";
import { GameMode, ICard } from "../../../../../common/communication/iCard";
import { GameType, IGameRequest } from "../../../../../common/communication/iGameRequest";
import { ISceneVariables, ISceneVariablesMessage } from "../../../../../common/communication/iSceneVariables";
import { Message } from "../../../../../common/communication/message";
@Component({
  selector: "app-game-view-free",
  templateUrl: "./game-view-free.component.html",
  styleUrls: ["./game-view-free.component.css"],
})
export class GameViewFreeComponent implements OnInit {

  public readonly NEEDED_SNAPSHOT: boolean = false;
  public originalVariables: ISceneVariables;
  public modifiedVariables: ISceneVariables;
  public activeCard: ICard;
  private gameType: GameType;
  public gameRequest: IGameRequest;
  public originalLoaded: boolean;
  public modifiedLoaded: boolean;

  public constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    ) {
      this.originalLoaded = false;
      this.modifiedLoaded = false;
    }

  public ngOnInit(): void {
      const gameID: string | null = this.route.snapshot.paramMap.get("id");
      const username: string | null = sessionStorage.getItem(Constants.USERNAME_KEY);
      if (gameID !== null && username !== null) {
        this.createGameRequest(gameID, username);
      }
  }

  private createGameRequest(gameID: string, username: string): void {
     this.httpClient.get(Constants.PATH_TO_GET_CARD + gameID + "/" + GameMode.free).subscribe((response: ICard) => {
      this.activeCard = response;

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
      const path: string = JSON.parse(data.body);

      this.fetchSceneFromServer(path)
      .catch((error) => {
        this.openSnackBar(error, Constants.SNACK_ACTION);
      });
    });
  }

  private async fetchSceneFromServer(path: string): Promise<void> {
    fetch(path).then((response) => {
      this.loadFileInObject(response)
      // (index === 0) ? this.loadFileInObject(response) : this.loadFileInObject1(response)
      .catch((error) => {
        this.openSnackBar(error, Constants.SNACK_ACTION);
      });
    }
  }

  private async loadFileInObject1(response: Response): Promise<void> {
    if (response.status !== Constants.SUCCESS_STATUS) {
      this.openSnackBar(response.statusText, Constants.SNACK_ACTION);
    } else {
      await response.json().then((variables: ISceneVariables) => {
        this.modifiedVariables = {
          theme: variables.theme,
          gameName: variables.gameName,
          sceneBackgroundColor: variables.sceneBackgroundColor,
          sceneObjects: variables.sceneObjects,
          sceneObjectsQuantity: variables.sceneObjectsQuantity,
        };
        this.modifiedLoaded = true;
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
