import { HttpClient } from "@angular/common/http";
import { AfterContentInit, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { Mode } from "../../../../common/communication/highscore";
import { CardDeleted, ICard, ILobbyEvent, MultiplayerButtonText } from "../../../../common/communication/iCard";
import { CCommon } from "../../../../common/constantes/cCommon";
import { CClient } from "../CClient";
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

  @Input()  public card:                ICard;
  @Output() public cardDeleted:         EventEmitter<string>;

  public readonly TROPHY_IMAGE_URL:     string = "https://img.icons8.com/metro/1600/trophy.png";
  public readonly TEXT_PLAY:            string = "JOUER";
  public readonly TEXT_RESET_TIMERS:    string = "RÉINITIALISER";
  public readonly TEXT_DELETE:          string = "SUPPRIMER";
  public readonly CONFIRMATION_DELETE:  string = "Voulez-vous vraiment supprimer le jeu";
  public readonly CONFIRMATION_RESET:   string = "Voulez-vous vraiment réinitialiser les meilleurs temps du jeu";
  public readonly RESET_SNACKBAR:       string = "Temps réinitialisé";
  public readonly ADMIN_PATH:           string = "/admin";
  public readonly JOIN_ICON:            string = "arrow_forward";
  public readonly CREATE_ICON:          string = "add";
  public readonly LOGO3D_URL:           string = CClient.PATH_TO_IMAGES + "/logo3D.png";
  public readonly LOGO2D_URL:           string = CClient.PATH_TO_IMAGES + "/logo2D.png";

  private dialogConfig:                 MatDialogConfig;
  public multiplayerButton:             string;
  public icon:                          string;
  public highscoreButtonIsClicked:      boolean;
  public logoUrl:                       string;
  public bestPlayer:                    string;

  public constructor(
    public  router:             Router,
    public  dialog:             MatDialog,
    public  gameModeService:    GameModeService,
    public  cardManagerService: CardManagerService,
    private highscoreService:   HighscoreService,
    private snackBar:           MatSnackBar,
    private httpClient:         HttpClient,
    ) {
      this.cardDeleted                = new EventEmitter();
      this.multiplayerButton          = "CRÉER";
      this.icon                       = this.CREATE_ICON;
      this.dialogConfig               = new MatDialogConfig();
      this.dialogConfig.disableClose  = false;
      this.dialogConfig.width         = "450px";
      this.dialogConfig.height        = "170px";
      this.dialogConfig.position      = {bottom: "0%", top: "5%"};
      this.dialogConfig.autoFocus     = false;
  }

  public ngAfterContentInit(): void {
    if (this.card.lobbyExists) {
      this.multiplayerButton = CCommon.JOIN_TEXT;
      this.icon = this.JOIN_ICON;
    }

    this.highscoreService.getHighscore(this.card.gameID);
    this.cardManagerService.getButtonListener().subscribe((lobbyEvent: ILobbyEvent) => {
      if (this.card.gameID === lobbyEvent.gameID) {
        this.multiplayerButton = lobbyEvent.buttonText;
        this.icon              = (lobbyEvent.buttonText === MultiplayerButtonText.join) ? this.JOIN_ICON : this.CREATE_ICON;
      }
    });
    this.logoUrl =  this.card.gamemode === CClient.GAMEMODE_SIMPLE ? this.LOGO2D_URL : this.LOGO3D_URL;
  }

  public  onDeleteButtonClick(): void {
    this.dialogConfig.data = {
      message: this.CONFIRMATION_DELETE,
      gameTitle: this.card.title,
    };

    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialog.open(ConfirmationDialogComponent, this.dialogConfig);
    dialogRef.beforeClosed().subscribe((result: boolean) => {
      if (result) {
        this.deleteCard();
      }
    });
  }

  public deleteCard(): void {
    this.cardManagerService.removeCard(this.card.gameID, this.card.gamemode).subscribe((response: string) => {
      this.httpClient.get(CClient.CANCEL_REQUEST_PATH + this.card.gameID + "/" + CardDeleted.true).subscribe();
      this.openSnackbar(response);
      this.cardDeleted.emit();
    });
  }

  public onResetButtonClick(): void {
    this.dialogConfig.data = {
      message: this.CONFIRMATION_RESET,
      gameTitle: this.card.title,
    };

    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialog.open(ConfirmationDialogComponent, this.dialogConfig);
    dialogRef.beforeClosed().subscribe((result: boolean) => {
      if (result) {
        this.highscoreService.resetHighscore(this.card.gameID);
        this.openSnackbar(this.RESET_SNACKBAR);
      }
    });
  }

  private openSnackbar(response: string): void {
    this.snackBar.open( response, CClient.SNACK_ACTION, {
      duration:           CClient.SNACKBAR_DURATION,
      verticalPosition:   "top",
      panelClass:         ["snackbar"],
    });
  }

  public setBestPlayer(value: string): void {
    this.bestPlayer = value;
  }

  public onHighscoreButtonClick(): void {
    this.highscoreButtonIsClicked = !this.highscoreButtonIsClicked;
    this.highscoreService.getHighscore(this.card.gameID);
  }

  public onStartGameClick(type: Mode): void {
    const gameModeComparison: boolean = this.card.gamemode === CClient.GAMEMODE_SIMPLE;
    const gameModePath:       string  = gameModeComparison ? CClient.GAME_VIEW_SIMPLE_PATH : CClient.GAME_VIEW_FREE_PATH;

    this.router.navigate([gameModePath, this.card.gameID, type]).catch((error) => this.openSnackbar(error));
  }

}
