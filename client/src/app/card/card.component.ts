import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
// import { CardModel } from "../../../../common/communication/cardModel";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {
  public _HSButtonIsClicked: boolean;
  // public _title: string = "Chien couché";
  // public _subtitle: string = "Animaux";
  // public _avatarImageUrl: string =
  //   "https://material.angular.io/assets/img/examples/shiba1.jpg";
  // public _gameImageUrl: string =
  //   "http://www.123mobilewallpapers.com/wp-content/uploads/2014/07/the_best_dog.jpg";
  public _trophyImageUrl: string = "https://img.icons8.com/metro/1600/trophy.png";
  public _textPlay: string = "JOUER";
  public _textPlaySingle: string = "Jouer en simple";
  public _textPlayMulti: string = "Jouer en multijoueur";
  public _textResetTimers: string = "Réinitialiser les temps";
  public _textDelete: string = "Supprimer la carte";
  public _adminPath: string = "/admin";

  @Input() public _cardModel: Object = {
    gameID: 1,
    title: "",
    subtitle: "",
    avatarImageUrl: "",
    gameImageUrl: "",
  };

  public constructor(public router: Router) {
    // default constructor
  }

  public ngOnInit(): void {
    // default init
  }

  public onHSButtonClick(): void {
    this._HSButtonIsClicked = !this._HSButtonIsClicked;

  }
}
