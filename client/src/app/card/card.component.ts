import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ICard } from "../../../../common/communication/iCard";
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
    ) {
    // default constructor
  }

  @Output() public cardDeleted: EventEmitter<string> = new EventEmitter<string>();

  public ngOnInit(): void {/* default init */}

  public onDeleteButtonClick(): void {
    this.gameModeService.removeCard(this.card.gameID, this.card.gamemode).subscribe(() => {
      this.cardDeleted.next(undefined);
    });
  }

  public onHSButtonClick(): void {
    this.HS_BUTTON_IS_CLICKED = !this.HS_BUTTON_IS_CLICKED;

  }
}
