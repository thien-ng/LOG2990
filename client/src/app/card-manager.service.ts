import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";
import { GameMode } from "../../../common/communication/iCard";
import { ICardLists } from "../../../common/communication/iCardLists";
import { Constants } from "./constants";

@Injectable({
  providedIn: "root",
})
export class CardManagerService {

  private cardCreated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public cardCreatedObservable: Observable<boolean> = this.cardCreated.asObservable();

  public constructor(private http: HttpClient) {
    // Default Constructor
  }

  public getCards(): Observable<ICardLists> {
    return this.http.get<ICardLists>(Constants.BASIC_SERVICE_BASE_URL + Constants.CARDS_PATH);
  }

  public removeCard(cardId: number, mode: GameMode): Observable<string> {
    return this.http.delete<string>(Constants.BASIC_SERVICE_BASE_URL + Constants.REMOVE_CARD_PATH + "/" + mode + "/" + cardId);
  }

  public updateCards(value: boolean): void {
    this.cardCreated.next(value);
  }
}
