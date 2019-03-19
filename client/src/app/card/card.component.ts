import { HttpClient } from "@angular/common/http";
import { AfterContentInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { DialogPosition, MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { Mode } from "../../../../common/communication/highscore";
import { CardDeleted, ICard, ILobbyEvent } from "../../../../common/communication/iCard";
import { Constants } from "../constants";
import { GameModeService } from "../game-list-container/game-mode.service";
import { HighscoreService } from "../highscore-display/highscore.service";
import { CardManagerService } from "./card-manager.service";
import { ConfirmationDialogComponent } from "./confirmation-dialog/confirmation-dialog.component";

const JOIN_TEXT: string = "JOINDRE";

@Component({
  selector:     "app-card",
  templateUrl:  "./card.component.html",
  styleUrls:    ["./card.component.css"],
  providers:    [HighscoreService],
})

export class CardComponent implements AfterContentInit {

  public readonly TROPHY_IMAGE_URL:   string = "https://img.icons8.com/metro/1600/trophy.png";
  public readonly TEXT_PLAY:          string = "JOUER";
  public readonly TEXT_PLAY_SINGLE:   string = "Jouer en simple";
  public readonly TEXT_PLAY_MULTI:    string = "Jouer en multijoueur";
  public readonly TEXT_RESET_TIMERS:  string = "RÉINITIALISER";
  public readonly TEXT_DELETE:        string = "SUPPRIMER";
  public readonly ADMIN_PATH:         string = "/admin";

  public multiplayerButton:           string = "CRÉER";
  public hsButtonIsClicked:           boolean;
  @Input()  public card:              ICard;
  @Output() public cardDeleted:       EventEmitter<string>;

  public constructor(
    public  router:             Router,
    public  gameModeService:    GameModeService,
    public  cardManagerService: CardManagerService,
    private snackBar:           MatSnackBar,
    private highscoreService:   HighscoreService,
    public  dialog:             MatDialog,
    private httpClient:         HttpClient,
    ) {
      this.cardDeleted = new EventEmitter();
  }

  public ngAfterContentInit(): void {
    if (this.card.lobbyExists) {
      this.multiplayerButton = JOIN_TEXT;
    }

    this.cardManagerService.getButtonListener().subscribe((lobbyEvent: ILobbyEvent) => {
      if (this.card.gameID === lobbyEvent.gameID) {
        this.multiplayerButton = lobbyEvent.displayText;
      }
    });
  }

  public  onDeleteButtonClick(): void {
    const dialogConfig:   MatDialogConfig = new MatDialogConfig();
    const dialogPosition: DialogPosition  = {bottom: "0%", top: "5%"};

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width        = "450px";
    dialogConfig.height       = "150px";
    dialogConfig.position     = dialogPosition;
    dialogConfig.data         = this.card.title;

    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe((result: boolean) => {
      if (result) {
        this.deleteCard();
      }
    });
  }

  public deleteCard(): void {
    this.cardManagerService.removeCard(this.card.gameID, this.card.gamemode).subscribe((response: string) => {
      this.httpClient.get(Constants.CANCEL_REQUEST_PATH + this.card.gameID + "/" + CardDeleted.true).subscribe();
      this.openSnackbar(response);
      this.cardDeleted.emit();
    });
  }

  public onResetButtonClick(): void {
    this.highscoreService.resetHighscore(this.card.gameID);
  }

  private openSnackbar(response: string): void {
    this.snackBar.open( response, Constants.SNACK_ACTION, {
      duration:           Constants.SNACKBAR_DURATION,
      verticalPosition:   "top",
      panelClass:         ["snackbar"],
    });
  }

  public onHSButtonClick(): void {
    this.hsButtonIsClicked = !this.hsButtonIsClicked;
    this.highscoreService.getHighscore(this.card.gameID);
  }

  public onStartGameClick(type: Mode): void {
    const gameModeComparison: boolean = this.card.gamemode === Constants.GAMEMODE_SIMPLE;
    const gameModePath:       string  = gameModeComparison ? Constants.GAME_VIEW_SIMPLE_PATH : Constants.GAME_VIEW_FREE_PATH;

    this.router.navigate([gameModePath, this.card.gameID, type]).catch((error) => this.openSnackbar(error));
  }

}
