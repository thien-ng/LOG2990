import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HighscoreMessage, StringFormatedTime } from "../../../../common/communication/highscore";
import { CClient } from "../CClient";
import { CardManagerService } from "../card/card-manager.service";

@Injectable()
export class HighscoreService {

  private readonly SELECTOR:  string = ":";
  private readonly MIN_TIME:  number = 0;
  private readonly MAX_TIME:  number = 60;

  private highscoreUpdated:   Subject<HighscoreMessage>;

  public constructor(
    private cardManagerService: CardManagerService,
    private httpClient:         HttpClient,
    ) {
    this.highscoreUpdated = new Subject<HighscoreMessage>();
    this.cardManagerService.getHighscoreListener().subscribe((gameID: number) => {
      this.getHighscore(gameID);
    });
  }

  public getHighscoreUpdateListener(): Observable<HighscoreMessage> {
    return this.highscoreUpdated.asObservable();
  }

  public getHighscore(id: number): void {
    this.httpClient.get(CClient.HIGHSCORE_PATH + id).subscribe((data: HighscoreMessage) => {
      if (this.validateId(data.id) && this.validateTimes(data.timesSingle) && this.validateTimes(data.timesMulti)) {
        this.highscoreUpdated.next(data);
      }
    });
  }

  public resetHighscore(id: number): void {
    this.httpClient.get(CClient.HIGHSCORE_PATH + CClient.RESET_PATH + id).subscribe(() => {
      this.getHighscore(id);
    });
  }

  private validateId(id: number): boolean {
    return id > 0;
  }

  private validateSelector(timeElement: string, selector: string): boolean {
    return timeElement.indexOf(selector) >= 0;
  }

  private validateTimes(times: StringFormatedTime[]): boolean {
    let isValid: boolean = true;

    times.forEach((timeElement) => {
      let highscoreSplit: string[] = [];

      if (this.validateSelector(timeElement.time, this.SELECTOR)) {
        highscoreSplit = timeElement.time.split(this.SELECTOR);

        highscoreSplit.forEach((splitElement) => {
          if (Number(splitElement) > this.MAX_TIME || Number(splitElement) < this.MIN_TIME) {
            isValid = false;
          }
        });
      } else {
        isValid = false;
      }
    });

    return isValid;
  }
}
