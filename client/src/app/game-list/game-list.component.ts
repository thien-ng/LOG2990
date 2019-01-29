import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ICard } from "../../../../common/communication/iCard";
import { CardComponent } from "../card/card.component";

@Component({
  selector: "app-game-list",
  templateUrl: "./game-list.component.html",
  styleUrls: ["./game-list.component.css"],
})
export class GameListComponent implements OnInit {
  @Input() public cards: ICard[];
  @Output() public cardDeleted: EventEmitter<string> = new EventEmitter();

  public cardComponent: CardComponent;

  public updateCards(): void {
    this.cardDeleted.emit();
  }

  public constructor() { /* default constructor */ }

  public ngOnInit(): void { /* default ngOnInit */ }

}
