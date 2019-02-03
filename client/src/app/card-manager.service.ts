import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable } from "rxjs";
import { GameMode } from "../../../common/communication/iCard";
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

  public getCards(): Observable<Object> {
    return this.http.get(Constants.BASIC_SERVICE_BASE_URL + Constants.CARDS_PATH);
  }

  public removeCard(cardId: number, mode: GameMode): Observable<Object> {
    return this.http.delete(Constants.BASIC_SERVICE_BASE_URL + Constants.REMOVE_CARD_PATH + "/" + mode + "/" + cardId);
  }

  public updateCards(value: boolean): void {
    this.cardCreated.next(value);
  }
}
