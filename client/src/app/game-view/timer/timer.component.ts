import { Component, Inject } from "@angular/core";
import { TimerService } from "./timer.service";

@Component({
  selector:     "app-timer",
  templateUrl:  "./timer.component.html",
  styleUrls:    ["./timer.component.css"],
})
export class TimerComponent {

  private readonly START_TIME: string = "00:00";

  public time: string;

  public constructor(@Inject(TimerService) public timerService: TimerService) {
    this.time = this.START_TIME;
    this.timerService.getTimer().subscribe((newTime: string) => {
      this.time = newTime;
    });
  }
}
