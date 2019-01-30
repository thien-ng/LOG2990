import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { ICard } from "../../../../common/communication/iCard";
import { CardManagerService } from "../card-manager.service";
import { Constants } from "../constants";
import { GameModeService } from "../game-list-container/game-mode.service";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
  public HS_BUTTON_IS_CLICKED: boolean;
  public TROPHY_IMAGE_URL: string = "https://img.icons8.com/metro/1600/trophy.png";
  public TEXT_PLAY: string = "JOUER";
  public TEXT_PLAY_SINGLE: string = "Jouer en simple";
  public TEXT_PLAY_MULTI: string = "Jouer en multijoueur";
  public TEXT_RESET_TIMERS: string = "Réinitialiser les temps";
  public TEXT_DELETE: string = "Supprimer la carte";
  public ADMIN_PATH: string = "/admin";

  @Input() public card: ICard;

  public constructor(
    public router: Router,
    public gameModeService: GameModeService,
    public cardManagerService: CardManagerService,
    private snackBar: MatSnackBar,
    ) { /* default constructor */ }

  @Output() public cardDeleted: EventEmitter<string> = new EventEmitter();

  public ngOnInit(): void { /* default init */ }

  public onDeleteButtonClick(): void {
    this.cardManagerService.removeCard(this.card.gameID, this.card.gamemode).subscribe((response: string) => {
      this.snackBar.open( response, Constants.SNACK_ACTION, {
        duration: Constants.SNACKBAR_DURATION,
        verticalPosition: "top",
      });
      this.cardDeleted.emit();
    });
  }

  public onHSButtonClick(): void {
    this.HS_BUTTON_IS_CLICKED = !this.HS_BUTTON_IS_CLICKED;

  }
}
