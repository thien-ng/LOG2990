import { Injectable } from "@angular/core";
import { Constants } from "../../constants";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TimerService {

  private readonly START_TIME: string = "00:00";

  private timeUpdated: BehaviorSubject<string>;
  public timeUpdatedObservable: Observable<string>;

  public constructor() {
    this.timeUpdated = new BehaviorSubject<string>(this.START_TIME);
    this.timeUpdatedObservable = this.timeUpdated.asObservable();
  }

  public get timer(): Observable<string> {
    return this.timeUpdatedObservable;
  }

  public timeFormat(totalTimeInSeconds: number): void {
    const min: number = Math.floor((totalTimeInSeconds / Constants.MINUTE_IN_SECONDS));
    const sec: number = totalTimeInSeconds - (min * Constants.MINUTE_IN_SECONDS);

    let timeFormat: string = (min < Constants.TWO_DIGITS ? "0" + min.toString() : min.toString());
    timeFormat += ":" + (sec < Constants.TWO_DIGITS ? "0" + sec.toString() : sec.toString());

    this.timeUpdated.next(timeFormat);
  }
}
