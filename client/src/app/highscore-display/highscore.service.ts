import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HighscoreMessage } from "../../../../common/communication/highscore";
import { Constants } from "../constants";

@Injectable()
export class HighscoreService {
  private readonly SELECTOR: string = ":";
  private readonly MIN_TIME: number = 0;
  private readonly MAX_TIME: number = 60;

  private highscoreUpdated: Subject<HighscoreMessage>;

  public constructor(private httpClient: HttpClient) {
    this.highscoreUpdated = new Subject<HighscoreMessage>();
  }

  public getHighscoreUpdateListener(): Observable<HighscoreMessage> {
    return this.highscoreUpdated.asObservable();
  }

  public getHighscore(id: number): void {
    this.httpClient.get(Constants.HIGHSCORE_PATH + id).subscribe((data: HighscoreMessage) => {
      this.highscoreUpdated.next(data);
    });
  }

  public resetHighscore(id: number): void {
    this.httpClient.get(Constants.HIGHSCORE_PATH + Constants.RESET_PATH + id).subscribe(() => {
      this.getHighscore(id);
    });
  }

}
