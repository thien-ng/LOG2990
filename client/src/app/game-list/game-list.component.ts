import { Component, OnInit } from "@angular/core";
// Va etre utilise dans le futur
// import { CardProperties } from "../../../../common/communication/cardModel",
import { CardComponent } from "../card/card.component";

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
