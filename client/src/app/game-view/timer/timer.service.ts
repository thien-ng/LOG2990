import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Constants } from "../../constants";

@Injectable({
  providedIn: "root",
})
export class TimerService {

  private timeUpdated: Subject<string>;

  public constructor() {
    this.timeUpdated = new Subject<string>();
  }

  public get timer(): Observable<string> {
    return this.timeUpdated.asObservable();
  }

  public timeFormat(totalTimeInSeconds: number): void {
    const min: number = Math.floor((totalTimeInSeconds / Constants.MINUTE_IN_SECONDS));
    const sec: number = totalTimeInSeconds - (min * Constants.MINUTE_IN_SECONDS);

    let timeFormat: string = (min < Constants.TWO_DIGITS ? "0" + min.toString() : min.toString());
    timeFormat += ":" + (sec < Constants.TWO_DIGITS ? "0" + sec.toString() : sec.toString());

    this.timeUpdated.next(timeFormat);
  }
}
