import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { CardMessage } from "../../../common/communication/card-message";
import { GameMode } from "../../../common/communication/iCard";
import { Constants } from "./constants";

@Injectable({
  providedIn: "root",
})
export class CardManagerService {

  public constructor(private _http: HttpClient) { /* Default Constructor */ }

  public getCards(): Observable<Object> {
    return this._http.get(Constants.BASIC_SERVICE_BASE_URL + Constants.CARDS_PATH);
  }

  public removeCard(cardId: number, mode: GameMode): Observable<Object> {
    const message: CardMessage = {
      title: "onDelete",
      id: cardId,
      gameMode: mode,
    };

    return this._http.post(Constants.BASIC_SERVICE_BASE_URL + Constants.REMOVE_CARD_PATH, message);
  }
}
