import { Component, Input, OnInit } from "@angular/core";
// Va etre utilise dans le futur
import { CardModel } from "../../../../common/communication/cardModel";
import { CardComponent } from "../card/card.component";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})
export class GameListComponent implements OnInit {
  @Input() public _cardList: CardModel[];

  public cardComponent: CardComponent;

  public constructor(/*public cards: CardModel[]*/) {
    // default constructor
  }

  public ngOnInit(): void {
    // default ngOnInit
  }

}
