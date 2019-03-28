import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { CClient } from "../../CClient";

@Injectable({
  providedIn: "root",
})
export class TimerService {

  private timeUpdated: Subject<string>;

  public constructor() {
    this.timeUpdated = new Subject<string>();
  }

  public getTimer(): Observable<string> {
    return this.timeUpdated.asObservable();
  }

  public timeFormat(totalTimeInSeconds: number): void {
    const min: number = Math.floor((totalTimeInSeconds / CClient.SECONDS_IN_MINUTE));
    const sec: number = totalTimeInSeconds - (min * CClient.SECONDS_IN_MINUTE);

    let timeFormat: string = (min < CClient.DECIMAL_BASE ? "0" + min.toString() : min.toString());

    timeFormat += ":" + (sec < CClient.DECIMAL_BASE ? "0" + sec.toString() : sec.toString());

    this.timeUpdated.next(timeFormat);
  }
}
