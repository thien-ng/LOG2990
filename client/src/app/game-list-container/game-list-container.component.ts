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

  public _index2D: number = 0;
  public _index3D: number = 1;
  public _tabIndex: number = 0;
  private _stateSubscription: Subscription;

  public cardsLoaded: boolean = false;
  @Input() public _cardListContainer: ICardLists;

  public constructor(
    public gameModeservice: GameModeService,
    public cardManagerService: CardManagerService,
    private adminService: AdminToggleService,
    public router: Router,
    ) { /* Default constructor */ }

  public ngOnInit(): void {
    this._tabIndex = this.gameModeservice.getIndex();
    if (this.router.url === Constants.ADMIN_REDIRECT) {
      this.adminService.adminTrue();
    }
    this._stateSubscription = this.gameModeservice.getGameModeUpdateListener()
      .subscribe((index: number) => {
        this._tabIndex = index;
    });
    this.getCards();
  }

  public getCards(): void {
    this.cardManagerService.getCards()
    .subscribe((cards: ICardLists) => {
      this._cardListContainer = cards;
      this.cardsLoaded = true;
    });
  }

  public ngOnDestroy(): void {
    this._stateSubscription.unsubscribe();
  }

}
