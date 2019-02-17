import { Component, EventEmitter, Input, Output } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { ICard } from "../../../../common/communication/iCard";
import { Constants } from "../constants";
import { GameModeService } from "../game-list-container/game-mode.service";
import { ActiveGameService } from "../game-view/active-game.service";
import { HighscoreService } from "../highscore-display/highscore.service";
import { CardManagerService } from "./card-manager.service";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
  providers: [HighscoreService],
})

export class CardComponent {
  public readonly TROPHY_IMAGE_URL: string = "https://img.icons8.com/metro/1600/trophy.png";
  public readonly TEXT_PLAY: string = "JOUER";
  public readonly TEXT_PLAY_SINGLE: string = "Jouer en simple";
  public readonly TEXT_PLAY_MULTI: string = "Jouer en multijoueur";
  public readonly TEXT_RESET_TIMERS: string = "Réinitialiser les temps";
  public readonly TEXT_DELETE: string = "Supprimer la carte";
  public readonly ADMIN_PATH: string = "/admin";

  public hsButtonIsClicked: boolean;
  @Input() public card: ICard;
  @Output() public cardDeleted: EventEmitter<string>;

  public constructor(
    public router: Router,
    public gameModeService: GameModeService,
    public cardManagerService: CardManagerService,
    private snackBar: MatSnackBar,
    private highscoreService: HighscoreService,
    private activeGameService: ActiveGameService,
    ) {
      this.cardDeleted = new EventEmitter();
    }

  public onDeleteButtonClick(): void {
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
      duration: Constants.SNACKBAR_DURATION,
      verticalPosition: "top",
      panelClass: ["snackbar"],
    });
  }

  public onHSButtonClick(): void {
    this.hsButtonIsClicked = !this.hsButtonIsClicked;
    this.highscoreService.getHighscore(this.card.gameID);
  }

  public onStartGameClick(): void {
    const gameModeComparison: boolean = this.card.gamemode === Constants.GAMEMODE_SIMPLE;
    let gameModePath: string = gameModeComparison ? Constants.GAME_VIEW_SIMPLE_PATH : Constants.GAME_VIEW_FREE_PATH;
    gameModePath += "/" + this.card.gameID;

    this.router.navigate([gameModePath]).catch(() => Constants.OBLIGATORY_CATCH);
  }

}
