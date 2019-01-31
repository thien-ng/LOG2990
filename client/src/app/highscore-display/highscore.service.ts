import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HighscoreMessage } from "../../../../common/communication/highscore";
import { Constants } from "../constants";

@Injectable()
export class HighscoreService {

  public constructor(private http: HttpClient) {
    // Default constructor
  }

  private highscoreUpdated: Subject<HighscoreMessage> = new Subject<HighscoreMessage>();

  public getHighscoreUpdateListener(): Observable<HighscoreMessage> {
    return this.highscoreUpdated.asObservable();
  }

  public getHighscore(id: number): void {
    this.http.get(Constants.BASIC_SERVICE_BASE_URL + Constants.HIGHSCORE_PATH + "/" + id).subscribe((data: HighscoreMessage) => {
      this.highscoreUpdated.next(data);
    });
  }

}
