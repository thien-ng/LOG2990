import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { Subscription } from "rxjs";
import { AdminToggleService } from "../admin-toggle.service";
import { Constants } from "../constants";
import { Is2Dor3DService } from "./is2-dor3-d.service";

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

  @Input() public _cardListContainer: Object[][] = [[
    {
      gameID: 0, title: "Super chaise", subtitle: "petite chaise ",
      // tslint:disable-next-line:max-line-length
      avatarImageUrl: "https://www.cc-autunois.com/wp-content/uploads/2018/11/chaise-reglable-hauteur-elegant-chaise-bois-hauteur-reglable-sur-patins-avec-repose-de-chaise-reglable-hauteur.jpg", gameImageUrl: "https://www.cc-autunois.com/wp-content/uploads/2018/11/chaise-reglable-hauteur-elegant-chaise-bois-hauteur-reglable-sur-patins-avec-repose-de-chaise-reglable-hauteur.jpg",
    },
    {
      gameID: 1, title: "Super tabouret", subtitle: "petit tabouret ",
      // tslint:disable-next-line:max-line-length
      avatarImageUrl: "http://amyscakesandmore.com/wp-content/uploads/5395/tabouret-de-bar-moderne-qui-vient-en-plusieurs-couleurs-vives.jpg", gameImageUrl: "http://amyscakesandmore.com/wp-content/uploads/5395/tabouret-de-bar-moderne-qui-vient-en-plusieurs-couleurs-vives.jpg",
    },
  ],
                                                    [
    {
      gameID: 3, title: "Super chaise", subtitle: "petite chaise ",
      // tslint:disable-next-line:max-line-length
      avatarImageUrl: "http://lebaneezgirl11.l.e.pic.centerblog.net/sch1p9t8.jpg", gameImageUrl: "http://lebaneezgirl11.l.e.pic.centerblog.net/sch1p9t8.jpg",
    },
    {
      gameID: 4, title: "Super tabouret", subtitle: "petit tabouret ",
      // tslint:disable-next-line:max-line-length
      avatarImageUrl: "http://www.humour-canin.com/images/canin/wallpapers/real_3015_husky.jpg", gameImageUrl: "http://www.humour-canin.com/images/canin/wallpapers/real_3015_husky.jpg",
    },
  ]];

  public constructor(
    public _2Dservice: Is2Dor3DService,
    private _adminService: AdminToggleService,
    public router: Router,
    ) {}

  public ngOnInit(): void {
    this._tabIndex = this._2Dservice.get2DState();
    if (this.router.url === Constants.ADMIN_REDIRECT) {
      this._adminService.adminTrue();
    }
    this._stateSubscription = this._2Dservice.get2DUpdateListener()
      .subscribe((index: number) => {
        this._tabIndex = index;
    });
  }

  public ngOnDestroy(): void {
    this._stateSubscription.unsubscribe();
  }

}
