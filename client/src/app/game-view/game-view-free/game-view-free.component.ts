import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { ActivatedRoute } from "@angular/router";
import { first } from "rxjs/operators";
import { Constants } from "src/app/constants";
import { GameConnectionService } from "src/app/game-connection.service";
import { SocketService } from "src/app/websocket/socket.service";
import { Mode } from "../../../../../common/communication/highscore";
import { GameMode, ICard } from "../../../../../common/communication/iCard";
import { IGameRequest } from "../../../../../common/communication/iGameRequest";
import { IPosition2D } from "../../../../../common/communication/iGameplay";
import { ISceneObject } from "../../../../../common/communication/iSceneObject";
import { ISceneData, ISceneVariables } from "../../../../../common/communication/iSceneVariables";
import { Message } from "../../../../../common/communication/message";
import { CCommon } from "../../../../../common/constantes/cCommon";
import { GameViewFreeService } from "./game-view-free.service";
import { TheejsViewComponent } from "./threejs-view/threejs-view.component";

const GAMEMODE_KEY: string = "gamemode";
const RIGHT_CLICK:  number = 2;

@Component({
  selector:     "app-game-view-free",
  templateUrl:  "./game-view-free.component.html",
  styleUrls:    ["./game-view-free.component.css"],
})
export class GameViewFreeComponent implements AfterViewInit, OnInit, OnDestroy {

  public readonly NEEDED_SNAPSHOT:  boolean = false;
  public readonly SUCCESS_SOUND:    string  = "http://localhost:3000/audio/fail.wav";
  public readonly FAIL_SOUND:       string  = "http://localhost:3000/audio/success.wav";

  @ViewChild("original")      private original:    TheejsViewComponent;
  @ViewChild("modified")      private modified:    TheejsViewComponent;
  @ViewChild("successSound",  {read: ElementRef})  public successSound:    ElementRef;
  @ViewChild("failSound",     {read: ElementRef})  public failSound:       ElementRef;
  @ViewChild("erreurText",    {read: ElementRef})  public erreurText:      ElementRef;
  @ViewChild("erreurText2",   {read: ElementRef})  public erreurText2:     ElementRef;

  public  originalVariables: ISceneVariables;
  public  modifiedVariables: ISceneVariables;
  public  activeCard:        ICard;
  public  gameRequest:       IGameRequest;
  public  objectToUpdate:    ISceneObject[];
  public  isLoading:         boolean;
  public  rightClick:        boolean;
  public  gameIsStarted:     boolean;
  public  cardIsLoaded:      boolean;
  public  arenaID:           number;
  public  mode:              number;
  public  gameID:            string | null;
  public  username:          string | null;
  private scenePath:         string;
  private gameMode:          Mode;

  @HostListener("mousedown", ["$event"])
  public onMouseDown(mouseEvent: MouseEvent): void {
    if (mouseEvent.button === RIGHT_CLICK) {
      this.gameViewService.updateRightClick(true);
    }
  }

  @HostListener("mouseup", ["$event"])
  public onMouseUp(mouseEvent: MouseEvent): void {
    if (mouseEvent.button === RIGHT_CLICK) {
      this.gameViewService.updateRightClick(false);
    }
  }

  @HostListener("mousemove", ["$event"])
  public onMouseMove(mouseEvent: MouseEvent): void {
    if (this.rightClick) {
      const point: IPosition2D = {
        x: mouseEvent.movementX,
        y: mouseEvent.movementY,
      };
      this.original.onMouseMove(point);
      this.modified.onMouseMove(point);
    }
  }

  public constructor(
    @Inject(GameViewFreeService)    private gameViewService:  GameViewFreeService,
    @Inject(SocketService)          private socketService:    SocketService,
    private gameConnectionService:  GameConnectionService,
    private httpClient:             HttpClient,
    private route:                  ActivatedRoute,
    private snackBar:               MatSnackBar,
    ) {
      document.oncontextmenu = () => {
        return false;
      };
      this.rightClick     = true;
      this.cardIsLoaded   = false;
      this.gameIsStarted  = false;
      this.mode           = Number(this.route.snapshot.paramMap.get(GAMEMODE_KEY));
      this.username       = sessionStorage.getItem(Constants.USERNAME_KEY);

      this.gameConnectionService.getGameConnectedListener().pipe(first()).subscribe((arenaID: number) => {
        this.arenaID        = arenaID;
        this.gameIsStarted  = true;
        this.socketService.sendMsg(CCommon.GAME_CONNECTION, arenaID);
        this.fetchSceneFromServer(this.scenePath)
        .catch((error) => {
          this.openSnackBar(error, Constants.SNACK_ACTION);
        });
      });
    }

  public ngOnInit(): void {
    this.gameID = this.route.snapshot.paramMap.get("id");
    const username: string | null = sessionStorage.getItem(Constants.USERNAME_KEY);
    if (this.gameID !== null && username !== null) {
      this.createGameRequest(this.gameID, username);
    }
  }

  public ngAfterViewInit(): void {
    this.isLoading = true;
  }

  private createGameRequest(gameID: string, username: string): void {

    this.httpClient.get(Constants.PATH_TO_GET_CARD + gameID + "/" + GameMode.free).subscribe((response: ICard) => {
      this.activeCard = response;
      this.scenePath  = CCommon.BASE_URL + "/temp/" + this.activeCard.gameID + CCommon.SCENE_FILE;
      this.canvasRoutine();

      const type: string | null = this.route.snapshot.paramMap.get(GAMEMODE_KEY);
      if (type !== null) {
        this.getSceneVariables(type, username);
      }
      this.cardIsLoaded = true;
    });

  }

  private getSceneVariables(type: string, username: string): void {
    this.gameMode     = JSON.parse(type);
    this.gameRequest  = {
        username:     username,
        gameId:       this.activeCard.gameID,
        type:         this.gameMode,
        mode:         GameMode.free,
    };
    this.handleGameRequest();
  }

  private handleGameRequest(): void {
    this.httpClient.post(Constants.GAME_REQUEST_PATH, this.gameRequest).subscribe((data: Message) => {
      switch (data.title) {
        case CCommon.ON_SUCCESS:
          this.arenaID        = Number(data.body);
          this.gameIsStarted  = true;
          this.socketService.sendMsg(CCommon.GAME_CONNECTION, this.arenaID);
          this.fetchSceneFromServer(this.scenePath)
          .catch((error) => {
            this.openSnackBar(error, Constants.SNACK_ACTION);
          });
          this.gameViewService.setText(this.erreurText, this.erreurText2);
          break;
        case CCommon.ON_WAITING:
          this.arenaID = parseInt(data.body, Constants.DECIMAL_BASE);
          this.socketService.sendMsg(CCommon.GAME_CONNECTION, CCommon.ON_WAITING);
          break;
        case CCommon.ON_ERROR:
          this.openSnackBar(data.body, Constants.SNACK_ACTION);
          break;
        default:
          break;
      }
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

  public ngOnDestroy(): void {
    this.socketService.sendMsg(CCommon.GAME_DISCONNECT, this.username);
  }

  private canvasRoutine(): void {
    this.gameViewService.setSounds(this.successSound, this.failSound);
  }

}
