import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";
import { GameMode } from "../../../../common/communication/iCard";
import { ICardLists } from "../../../../common/communication/iCardLists";
import { Constants } from "../constants";

@Injectable({
  providedIn: "root",
})
export class CardManagerService {

  private cardCreated: BehaviorSubject<boolean>;
  public cardCreatedObservable: Observable<boolean>;

  public constructor(private httpClient: HttpClient) {
    this.cardCreated = new BehaviorSubject<boolean>(false);
    this.cardCreatedObservable = this.cardCreated.asObservable();
    }

  public getCards(): Observable<ICardLists> {
    return this.httpClient.get<ICardLists>(Constants.BASE_URL + Constants.CARDS_PATH);
  }

  public removeCard(cardId: number, mode: GameMode): Observable<string> {
    return this.httpClient.delete<string>(Constants.BASE_URL + Constants.REMOVE_CARD_PATH + "/" + mode + "/" + cardId);
  }

  public updateCards(value: boolean): void {
    this.cardCreated.next(value);
  }
}
