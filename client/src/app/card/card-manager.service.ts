import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { BehaviorSubject, Observable, Subject } from "rxjs";
import { GameMode } from "../../../../common/communication/iCard";
import { ICardLists } from "../../../../common/communication/iCardLists";
import { Constants } from "../constants";

@Injectable({
  providedIn: "root",
})
export class CardManagerService {

  private highscoreUpdated:       Subject<number>;
  private cardCreated:            BehaviorSubject<boolean>;
  public  cardCreatedObservable:  Observable<boolean>;

  public constructor(private httpClient: HttpClient) {
    this.highscoreUpdated = new Subject<number>();
    this.cardCreated = new BehaviorSubject<boolean>(false);
    this.cardCreatedObservable = this.cardCreated.asObservable();
    }

  public getCards(): Observable<ICardLists> {
    return this.httpClient.get<ICardLists>(Constants.CARDS_PATH);
  }

  public removeCard(gameID: number, mode: GameMode): Observable<string> {
    return this.httpClient.delete<string>(Constants.REMOVE_CARD_PATH + "/" + mode + "/" + gameID);
  }

  public getHighscoreListener(): Observable<number> {
    return this.highscoreUpdated.asObservable();
  }

  public reloadHighscore(gameID: number): void {
    this.highscoreUpdated.next(gameID);
  }

  public updateCards(value: boolean): void {
    this.cardCreated.next(value);
  }
}
