import { Component, OnInit } from "@angular/core";
// Va etre utilise dans le futur
import { CardModel } from "../../../../common/communication/cardModel";
import { CardComponent } from "../card/card.component";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})
export class GameListComponent implements OnInit {
  public cardModel: CardModel[] = [
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
];
  public _gameCardsArray: CardComponent[];

  public constructor(/*public cards: CardModel[]*/) {
    // default constructor
  }

  public ngOnInit(): void {
    // default ngOnInit
  }

}
