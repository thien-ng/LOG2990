import { Component, Input, OnInit } from "@angular/core";
import { CardModel } from "../../../../common/communication/cardModel";

@Component({
  selector: "app-game-list-container",
  templateUrl: "./game-list-container.component.html",
  styleUrls: ["./game-list-container.component.css"],
})
export class GameListContainerComponent implements OnInit {
  @Input() public _cardListContainer: CardModel[][] = [[
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

  public constructor() {
    // default constructor
  }

  public ngOnInit(): void {
    // default ngOnInit
  }

}
