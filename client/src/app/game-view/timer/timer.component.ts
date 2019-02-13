import { AfterContentInit, Component, Inject } from "@angular/core";
import { TimerService } from "./timer.service";
@Component({
  selector: "app-timer",
  templateUrl: "./timer.component.html",
  styleUrls: ["./timer.component.css"],
})
export class TimerComponent implements AfterContentInit {
  private readonly START_TIME: string = "00:00";
  private readonly INTERVAL: number = 1000;

  public time: string;
  private totalTime: number;

  public constructor(@Inject(TimerService) public timerService: TimerService) {
    this.time = this.START_TIME;
    this.totalTime = 0;
  }

  public ngAfterContentInit(): void {
    this.startTimer();
  }

  public startTimer(): void {
    setInterval(() => {
                this.time = this.timerService.convertSecondsToString(++this.totalTime);
    },          this.INTERVAL);
  }
}
