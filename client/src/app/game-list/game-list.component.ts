import { Component, OnInit } from "@angular/core";
import { CardComponent } from "../card/card.component";

export interface CardProperties {
  gameID: number;
  title: string;
  subtitle: string;
  avatarImageUrl: string;
  gameImageUrl: string;
}

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})
export class GameListComponent implements OnInit {

  public _gameCardsArray: CardComponent[];

  public constructor() {
    // default constructor
  }

  public ngOnInit(): void {
    // default ngOnInit
  }

}
