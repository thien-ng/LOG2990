import { HttpClient } from "@angular/common/http";
import { AfterContentInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { Mode } from "../../../../common/communication/highscore";
import { CardDeleted, ICard, ILobbyEvent, MultiplayerButtonText } from "../../../../common/communication/iCard";
import { CCommon } from "../../../../common/constantes/cCommon";
import { Constants } from "../constants";
import { GameModeService } from "../game-list-container/game-mode.service";
import { HighscoreService } from "../highscore-display/highscore.service";
import { CardManagerService } from "./card-manager.service";
import { ConfirmationDialogComponent } from "./confirmation-dialog/confirmation-dialog.component";

@Component({
  selector:     "app-card",
  templateUrl:  "./card.component.html",
  styleUrls:    ["./card.component.css"],
  providers:    [HighscoreService],
})

export class CardComponent implements AfterContentInit {

  public readonly TROPHY_IMAGE_URL:     string = "https://img.icons8.com/metro/1600/trophy.png";
  public readonly TEXT_PLAY:            string = "JOUER";
  public readonly TEXT_RESET_TIMERS:    string = "RÉINITIALISER";
  public readonly TEXT_DELETE:          string = "SUPPRIMER";
  public readonly CONFIRMATION_DELETE:  string = "Voulez-vous vraiment supprimer le jeu";
  public readonly CONFIRMATION_RESET:   string = "Voulez-vous vraiment reinitialiser les meilleurs temps du jeu";
  public readonly ADMIN_PATH:           string = "/admin";
  public readonly JOIN_ICON:            string = "arrow_forward";
  public readonly CREATE_ICON:          string = "add";

  public multiplayerButton:             string;
  public icon:                          string;
  public hsButtonIsClicked:             boolean;
  public dialogConfig:                  MatDialogConfig;
  @Input()  public card:                ICard;
  @Output() public cardDeleted:         EventEmitter<string>;

  public constructor(
    public  router:             Router,
    public  gameModeService:    GameModeService,
    public  cardManagerService: CardManagerService,
    private snackBar:           MatSnackBar,
    private highscoreService:   HighscoreService,
    public  dialog:             MatDialog,
    private httpClient:         HttpClient,
    ) {
      this.cardDeleted        = new EventEmitter();
      this.multiplayerButton  = "CRÉER";
      this.icon               = this.CREATE_ICON;
      this.dialogConfig       = new MatDialogConfig();
      this.dialogConfig.disableClose = false;
      this.dialogConfig.autoFocus    = true;
      this.dialogConfig.width        = "450px";
      this.dialogConfig.height       = "170px";
      this.dialogConfig.position     = {bottom: "0%", top: "5%"};
      this.dialogConfig.autoFocus    = false;
  }

  public ngAfterContentInit(): void {
    if (this.card.lobbyExists) {
      this.multiplayerButton = CCommon.JOIN_TEXT;
      this.icon = this.JOIN_ICON;
    }

    this.cardManagerService.getButtonListener().subscribe((lobbyEvent: ILobbyEvent) => {
      if (this.card.gameID === lobbyEvent.gameID) {
        this.multiplayerButton = lobbyEvent.buttonText;
        this.icon              = (lobbyEvent.buttonText === MultiplayerButtonText.join) ? this.JOIN_ICON : this.CREATE_ICON;
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
