import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Subscription } from "rxjs";
import { AdminToggleService } from "../admin-toggle.service";
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

  @Input() public _cardListContainer: Object[][] = [
    [
    {
      gameID: 0,
      title: "Montagne",
      subtitle: "Nature",
      avatarImageUrl:  Constants.PATH_TO_ASSETS + "/icon/fire_1.png",
      gameImageUrl: Constants.PATH_TO_ASSETS + "/image/moutain.jpg",
    },
    {
      gameID: 1,
      title: "Shiba Inu",
      subtitle: "Animaux",
      avatarImageUrl: Constants.PATH_TO_ASSETS + "/icon/fire_2.png",
      gameImageUrl: Constants.PATH_TO_ASSETS + "/image/shiba.jpg",
    },
  ],
    [
    {
      gameID: 3,
      title: "École de la mort",
      subtitle: "Torture",
      avatarImageUrl:  Constants.PATH_TO_ASSETS + "/icon/fire_2.png",
      gameImageUrl: Constants.PATH_TO_ASSETS + "/image/poly.jpg",
    },
    {
      gameID: 4,
      title: "Citrouilles",
      subtitle: "Nature",
      avatarImageUrl:  Constants.PATH_TO_ASSETS + "/icon/fire_3.png",
      gameImageUrl: Constants.PATH_TO_ASSETS + "/image/pumpkins.jpg",
    },
  ]];

  public constructor(
    public _gameModeservice: GameModeService,
    private _adminService: AdminToggleService,
    public router: Router,
    ) {}

  public ngOnInit(): void {
    this._tabIndex = this._gameModeservice.getIndex();
    if (this.router.url === Constants.ADMIN_REDIRECT) {
      this._adminService.adminTrue();
    }
    this._stateSubscription = this._gameModeservice.getGameModeUpdateListener()
      .subscribe((index: number) => {
        this._tabIndex = index;
    });
  }

  public ngOnDestroy(): void {
    this._stateSubscription.unsubscribe();
  }

}
