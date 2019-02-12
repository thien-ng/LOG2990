import { HttpClient } from "@angular/common/httpClient";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HighscoreMessage } from "../../../../common/communication/highscore";
import { Constants } from "../constants";

@Injectable()
export class HighscoreService {

  public constructor(private httpClient: HttpClient) {}

  private highscoreUpdated: Subject<HighscoreMessage> = new Subject<HighscoreMessage>();

  public getHighscoreUpdateListener(): Observable<HighscoreMessage> {
    return this.highscoreUpdated.asObservable();
  }

  public getHighscore(id: number): void {
    this.httpClient.get(Constants.BASIC_SERVICE_BASE_URL + Constants.HIGHSCORE_PATH + id).subscribe((data: HighscoreMessage) => {
      this.highscoreUpdated.next(data);
    });
  }

  public resetHighscore(id: number): void {
    this.httpClient.get(Constants.BASIC_SERVICE_BASE_URL + Constants.HIGHSCORE_PATH + Constants.RESET_PATH + id).subscribe(() => {
      this.getHighscore(id);
    });
  }

}
