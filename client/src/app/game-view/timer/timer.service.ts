import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class TimerService {
  private readonly MINUTE_TO_SECONDS: number = 60;
  private readonly TWO_DIGITS: number = 10;

  public constructor() {
    // default constructo
  }

  public convertSecondsToString(secondsInput: number): string {
    const min: number = Math.floor((secondsInput / this.MINUTE_TO_SECONDS));
    const sec: number = secondsInput - (min * this.MINUTE_TO_SECONDS);

    let result: string = (min < this.TWO_DIGITS ? "0" + min.toString() : min.toString());
    result += ":" + (sec < this.TWO_DIGITS ? "0" + sec.toString() : sec.toString());

    return result;
  }
}
