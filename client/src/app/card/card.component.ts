import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatDialog, MatDialogConfig, MatSnackBar, MatDialogRef, DialogPosition } from "@angular/material";
import { Router } from "@angular/router";
import { ICard } from "../../../../common/communication/iCard";
import { GameType } from "../../../../common/communication/iGameRequest";
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Constants } from "../constants";
import { GameModeService } from "../game-list-container/game-mode.service";
import { HighscoreService } from "../highscore-display/highscore.service";
import { CardManagerService } from "./card-manager.service";

@Component({
  selector:     "app-card",
  templateUrl:  "./card.component.html",
  styleUrls:    ["./card.component.css"],
  providers:    [HighscoreService],
})

export class CardComponent {

  public readonly TROPHY_IMAGE_URL:   string = "https://img.icons8.com/metro/1600/trophy.png";
  public readonly TEXT_PLAY:          string = "JOUER";
  public readonly TEXT_PLAY_SINGLE:   string = "Jouer en simple";
  public readonly TEXT_PLAY_MULTI:    string = "Jouer en multijoueur";
  public readonly TEXT_RESET_TIMERS:  string = "Réinitialiser";
  public readonly TEXT_DELETE:        string = "Supprimer";
  public readonly ADMIN_PATH:         string = "/admin";

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
    ) {
      this.cardDeleted = new EventEmitter();
    }

  public  onDeleteButtonClick(): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;
    dialogConfig.width = "450px";
    dialogConfig.height = "140px";
    const dialogPosition: DialogPosition = {bottom: "0%", top: "5%", left: "44.1%", right: "45%"};
    dialogConfig.position = dialogPosition;
    const dialogRef: MatDialogRef<ConfirmationDialogComponent> = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.beforeClosed().subscribe((result: boolean) => {
      if(result) {
        this.deleteCard();
      }
    });
  }

  public deleteCard(): void {
    this.cardManagerService.removeCard(this.card.gameID, this.card.gamemode).subscribe((response: string) => {
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

  public onStartGameClick(type: GameType): void {
    const gameModeComparison: boolean = this.card.gamemode === Constants.GAMEMODE_SIMPLE;
    const gameModePath:       string  = gameModeComparison ? Constants.GAME_VIEW_SIMPLE_PATH : Constants.GAME_VIEW_FREE_PATH;

    this.router.navigate([gameModePath, this.card.gameID, type]).catch((error) => this.openSnackbar(error));
  }

}
