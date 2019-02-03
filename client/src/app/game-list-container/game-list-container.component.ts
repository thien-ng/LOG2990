import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Subscription } from "rxjs";
import { ICardLists } from "../../../../common/communication/iCardLists";
import { AdminToggleService } from "../admin-toggle.service";
import { CardManagerService } from "../card-manager.service";
import { Constants } from "../constants";
import { GameModeService } from "./game-mode.service";

@Component({
  selector: "app-game-list-container",
  templateUrl: "./game-list-container.component.html",
  styleUrls: ["./game-list-container.component.css"],
})
export class GameListContainerComponent implements OnInit, OnDestroy {

  public tabIndex: number = 0;
  private stateSubscription: Subscription;

  public cardsLoaded: boolean = false;
  @Input() public cardListContainer: ICardLists;

  public constructor(
    public gameModeservice: GameModeService,
    public cardManagerService: CardManagerService,
    private adminService: AdminToggleService,
    public router: Router,
    ) {
      // Default constructor
    }

  public ngOnInit(): void {
    this.tabIndex = this.gameModeservice.getIndex();
    if (this.router.url === Constants.ADMIN_REDIRECT) {
      this.adminService.adminTrue();
    }
    this.stateSubscription = this.gameModeservice.getGameModeUpdateListener()
      .subscribe((index: number) => {
        this.tabIndex = index;
    });
    this.cardManagerService.cardCreatedObservable
    .subscribe((update: boolean) => {
      if (update) {
        this.getCards();
      }
    });
    this.getCards();
  }

  public getCards(): void {
    this.cardManagerService.getCards()
    .subscribe((cards: ICardLists) => {
      this.cardListContainer = cards;
      this.cardsLoaded = true;
    });
  }

  public ngOnDestroy(): void {
    this.stateSubscription.unsubscribe();
  }

}
