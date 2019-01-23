import { Component, Input, OnInit } from "@angular/core";
import { CardComponent } from "../card/card.component";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})
export class GameListComponent implements OnInit {
  @Input() public _cardList: Object[];

  public cardComponent: CardComponent;

  public constructor() {
    // default constructor
  }

  public ngOnInit(): void {
    // default ngOnInit
  }

}
