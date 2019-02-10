import { Component } from "@angular/core";
@Component({
  selector: "app-chronometre",
  templateUrl: "./chronometre.component.html",
  styleUrls: ["./chronometre.component.css"],
})
export class ChronometreComponent {
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

  private convertSecondsToString(sec: number): string {
    const min: number = Math.floor((sec / this.MINUTE_TO_SECONDS));
    const seconds: number = sec - (min * this.MINUTE_TO_SECONDS);

    let result: string = (min < this.TWO_DIGITS ? "0" + min.toString() : min.toString());
    result += ":" + (seconds < this.TWO_DIGITS ? "0" + seconds.toString() : seconds.toString());

    return result;
  }
}
