import { Injectable } from "@angular/core";
import { BasicService } from "../basic.service";
// import { TitleCasePipe } from '@angular/common';

import { AllCards } from "../../../../common/communication/allCards";
@Injectable({
  providedIn: "root",
})
export class GameListContainerService {

  public constructor(private _basicService: BasicService) { }

  public _allCards: AllCards;

  public getFromServerImage(): AllCards {

    this._basicService.getAllCards().subscribe((element) => {
        this._allCards = element;
    });

    return this._allCards;
  }
}
