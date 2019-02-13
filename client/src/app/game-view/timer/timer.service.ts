import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TimerService {
  private readonly MINUTE_IN_SECONDS: number = 60;
  private readonly TWO_DIGITS: number = 10;

  public timeFormat(totalTimeInSeconds: number): string {
    const min: number = Math.floor((totalTimeInSeconds / this.MINUTE_IN_SECONDS));
    const sec: number = totalTimeInSeconds - (min * this.MINUTE_IN_SECONDS);

    let timeFormat: string = (min < this.TWO_DIGITS ? "0" + min.toString() : min.toString());
    timeFormat += ":" + (sec < this.TWO_DIGITS ? "0" + sec.toString() : sec.toString());

    return timeFormat;
  }
}
