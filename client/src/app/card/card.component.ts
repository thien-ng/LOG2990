import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CardModel } from "../../../../common/communication/cardModel";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
  public _HSBUTTONISCLICKED: boolean;
  public _TROPHYIMAGEURL: string = "https://img.icons8.com/metro/1600/trophy.png";
  public _TEXTPLAY: string = "JOUER";
  public _TEXTPLAYSINGLE: string = "Jouer en simple";
  public _TEXTPLAYMULTI: string = "Jouer en multijoueur";
  public _TEXTRESETTIMERS: string = "Réinitialiser les temps";
  public _TEXTDELETE: string = "Supprimer la carte";
  public _ADMINPATH: string = "/admin";

  @Input() public _cardModel: CardModel;

  public constructor(public router: Router) {
    // default constructor
  }

  public ngOnInit(): void {/* default init */}

  public onHSButtonClick(): void {
    this._HSBUTTONISCLICKED = !this._HSBUTTONISCLICKED;

  }
}
