import { Component } from "@angular/core";
@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.css"],
})
export class TimerComponent {
  private readonly INTERVAL: number = 1000;
  private readonly MINUTE_TO_SECONDS: number = 60;
  private readonly TWO_DIGITS: number = 10;
  private readonly START_TIME: string = "00:00";

  private timeNumber: number;
  public timeString: string;

  public constructor() {
    this.timeNumber = 0;
    this.timeString = this.START_TIME;
    this.startTimer();
  }

  public startTimer(): void {
    setInterval(() => {
                this.timeString = this.convertSecondsToString(++this.timeNumber);
    },          this.INTERVAL);
  }

  private convertSecondsToString(secondsInput: number): string {
    const min: number = Math.floor((secondsInput / this.MINUTE_TO_SECONDS));
    const sec: number = secondsInput - (min * this.MINUTE_TO_SECONDS);

    let result: string = (min < this.TWO_DIGITS ? "0" + min.toString() : min.toString());
    result += ":" + (sec < this.TWO_DIGITS ? "0" + sec.toString() : sec.toString());

    return result;
  }
}
