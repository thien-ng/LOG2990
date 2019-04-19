import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ICard } from "../../../../common/communication/iCard";
import { ICardLists } from "../../../../common/communication/iCardLists";
import { CClient } from "../CClient";
import { CardManagerService } from "../card/card-manager.service";
import { AdminToggleService } from "../main-nav/admin-toggle.service";
import { GameModeService } from "./game-mode.service";

@Component({
  selector:     "app-game-list-container",
  templateUrl:  "./game-list-container.component.html",
  styleUrls:    ["./game-list-container.component.css"],
})
export class GameListContainerComponent implements OnInit, OnDestroy {

  @Input() public cardListContainer:  ICardLists;

  private stateSubscription:          Subscription;
  public tabIndex:                    number;
  public cardsLoaded:                 boolean;

  public constructor(
    public  router:             Router,
    public  gameModeservice:    GameModeService,
    public  cardManagerService: CardManagerService,
    private adminService:       AdminToggleService,
    ) {
    this.cardsLoaded  = false;
    this.tabIndex     = 0;
    }

  public ngOnInit(): void {
    this.initSubscription();
  }

  public initSubscription(): void {

    this.tabIndex = this.gameModeservice.getIndex();
    if (this.router.url === CClient.ADMIN_REDIRECT) {
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
    .subscribe((response: [ICardLists, number[]]) => {
      this.cardListContainer  = response[0];

      this.cardListContainer.list2D.forEach((card: ICard) => {
        if (response[1].includes(card.gameID)) {
          card.lobbyExists = true;
        }
      });

      this.cardListContainer.list3D.forEach((card: ICard) => {
        if (response[1].includes(card.gameID)) {
          card.lobbyExists = true;
        }
      });

      this.cardsLoaded = true;
    });
  }

  public ngOnDestroy(): void {
    if (this.stateSubscription !== undefined) {
      this.stateSubscription.unsubscribe();
    }
  }

}
