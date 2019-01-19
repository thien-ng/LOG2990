import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.css"],
})
export class CardComponent implements OnInit {

  public _isClicked: boolean;
  public _title: string = "Chien couché";
  public _subtitle: string = "Animaux";
  public _avatarImageUrl: string = "https://material.angular.io/assets/img/examples/shiba1.jpg";
  public _gameImageUrl: string = "http://www.123mobilewallpapers.com/wp-content/uploads/2014/07/the_best_dog.jpg";

  public _textPlay: string = "JOUER";
  public _textPlaySingle: string = "Jouer en simple";
  public _textPlayMulti: string = "Jouer en multijoueur";

  public constructor() {
    // default constructor
  }

  public ngOnInit(): void {
    // default init
  }

  public onClick(){
    this._isClicked = !this._isClicked;
  }

}
