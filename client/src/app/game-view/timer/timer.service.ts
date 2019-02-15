import { Injectable } from "@angular/core";
import { Constants } from "../../constants";
@Injectable({
  providedIn: "root",
})
export class TimerService {

  public timeFormat(totalTimeInSeconds: number): string {
    const min: number = Math.floor((totalTimeInSeconds / Constants.MINUTE_IN_SECONDS));
    const sec: number = totalTimeInSeconds - (min * Constants.MINUTE_IN_SECONDS);

    let timeFormat: string = (min < Constants.TWO_DIGITS ? "0" + min.toString() : min.toString());
    timeFormat += ":" + (sec < Constants.TWO_DIGITS ? "0" + sec.toString() : sec.toString());

    return timeFormat;
  }
}
