import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ICardLists } from "../../../../common/communication/iCardLists";
import { CardManagerService } from "../card/card-manager.service";
import { Constants } from "../constants";
import { AdminToggleService } from "../main-nav/admin-toggle.service";
import { GameModeService } from "./game-mode.service";

@Component({
  selector: "app-game-list-container",
  templateUrl: "./game-list-container.component.html",
  styleUrls: ["./game-list-container.component.css"],
})
export class GameListContainerComponent implements OnInit, OnDestroy {

  private stateSubscription: Subscription;
  @Input() public cardListContainer: ICardLists;
  public tabIndex: number;
  public cardsLoaded: boolean;

  public constructor(
    public gameModeservice: GameModeService,
    public cardManagerService: CardManagerService,
    private adminService: AdminToggleService,
    public router: Router,
    ) {
    this.cardsLoaded = false;
    this.tabIndex = 0;
    }

  public ngOnInit(): void {
    this.initSubscription();
  }

  public initSubscription(): void {

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
    if ( this.stateSubscription !== undefined){
      this.stateSubscription.unsubscribe();
    }
  }

}
