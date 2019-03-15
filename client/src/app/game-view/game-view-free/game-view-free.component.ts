import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { Constants } from "src/app/constants";
import { GameMode, ICard } from "../../../../../common/communication/iCard";
import { GameType, IGameRequest } from "../../../../../common/communication/iGameRequest";
import { ISceneData, ISceneVariables } from "../../../../../common/communication/iSceneVariables";
import { Message } from "../../../../../common/communication/message";
import { CCommon } from "../../../../../common/constantes/cCommon";

@Component({
  selector:     "app-game-view-free",
  templateUrl:  "./game-view-free.component.html",
  styleUrls:    ["./game-view-free.component.css"],
})
export class GameViewFreeComponent implements AfterViewInit, OnInit {

  public readonly NEEDED_SNAPSHOT: boolean = false;
  public originalVariables:   ISceneVariables;
  public modifiedVariables:   ISceneVariables;
  public activeCard:          ICard;
  public gameRequest:         IGameRequest;
  public isLoading:           boolean;
  public cardIsLoaded:        boolean;

  private gameType:           GameType;

  public constructor(
    private httpClient:     HttpClient,
    private route:          ActivatedRoute,
    private snackBar:       MatSnackBar,
    ) {
      this.cardIsLoaded = false;
    }

  public ngOnInit(): void {
      const gameID:   string | null = this.route.snapshot.paramMap.get("id");
      const username: string | null = sessionStorage.getItem(Constants.USERNAME_KEY);
      if (gameID !== null && username !== null) {
        this.createGameRequest(gameID, username);
      }
  }

  public ngAfterViewInit(): void {
    this.isLoading = true;
  }

  private createGameRequest(gameID: string, username: string): void {
     this.httpClient.get(Constants.PATH_TO_GET_CARD + gameID + "/" + GameMode.free).subscribe((response: ICard) => {
      this.activeCard = response;

      const type: string | null = this.route.snapshot.paramMap.get("gamemode");
      if (type !== null) {
        this.getSceneVariables(type, username);
      }
      this.cardIsLoaded = true;
    });

  }

  private getSceneVariables(type: string, username: string): void {
    this.gameType = JSON.parse(type);
    this.gameRequest = {
        username:     username,
        gameId:       this.activeCard.gameID,
        type:         this.gameType,
        mode:         GameMode.free,
    };
    this.handleGameRequest();
  }

  private handleGameRequest(): void {
    this.httpClient.post(Constants.GAME_REQUEST_PATH, this.gameRequest).subscribe((data: Message) => {

      if (data.title === CCommon.ON_ERROR) {
        this.openSnackBar(data.body, Constants.SNACK_ACTION);
      }
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
      .catch((error) => {
        this.openSnackBar(error, Constants.SNACK_ACTION);
      });
    }).catch((error) => {
      this.openSnackBar(error, Constants.SNACK_ACTION);
    });
  }

  private async loadFileInObject(response: Response): Promise<void> {
    if (response.status !== Constants.SUCCESS_STATUS) {
      this.openSnackBar(response.statusText, Constants.SNACK_ACTION);
    } else {
      await response.json().then((variables: ISceneData) => {

        this.assignSceneVariable(variables);
      }).catch((error) => {
        this.openSnackBar(error, Constants.SNACK_ACTION);
      });

      this.isLoading = false;
    }
  }

  private assignSceneVariable(variables: ISceneData): void {
    this.originalVariables = {
      theme:                  variables.originalScene.theme,
      gameName:               variables.originalScene.gameName,
      sceneBackgroundColor:   variables.originalScene.sceneBackgroundColor,
      sceneObjects:           variables.originalScene.sceneObjects,
      sceneObjectsQuantity:   variables.originalScene.sceneObjectsQuantity,
    };
    this.modifiedVariables = {
      theme:                  variables.modifiedScene.theme,
      gameName:               variables.modifiedScene.gameName,
      sceneBackgroundColor:   variables.modifiedScene.sceneBackgroundColor,
      sceneObjects:           variables.modifiedScene.sceneObjects,
      sceneObjectsQuantity:   variables.modifiedScene.sceneObjectsQuantity,
    };
  }

  private openSnackBar(msg: string, action: string): void {
    this.snackBar.open(msg, action, {
      duration:           Constants.SNACKBAR_DURATION,
      verticalPosition:   "top",
    });
  }
}
