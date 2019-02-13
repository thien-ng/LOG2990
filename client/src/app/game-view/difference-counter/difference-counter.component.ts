import { AfterContentInit, Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { DifferenceCounterService } from "./difference-counter.service";
@Component({
  selector: "app-difference-counter",
  templateUrl: "./difference-counter.component.html",
  styleUrls: ["./difference-counter.component.css"],
  providers: [DifferenceCounterService],
})
export class DifferenceCounterComponent implements AfterContentInit {
  public readonly DEFAULT_NB_ERROR_FOUND: number = 0;
  public readonly DEFAULT_NB_ERROR_MAX: number = 7;

  @ViewChild("progressCircle", { read: ElementRef })
  public progressCircle: ElementRef;
  @ViewChild("progressBar", { read: ElementRef })
  public progressBar: ElementRef;

  public constructor(@Inject(DifferenceCounterService) public differenceCounterService: DifferenceCounterService) {}

  public ngAfterContentInit(): void {
    this.differenceCounterService.setNbErrorMax(this.DEFAULT_NB_ERROR_MAX);
    this.updateSpinner(this.DEFAULT_NB_ERROR_FOUND);
  }

  public updateSpinner(errorFoundCounter: number): void {
    const angle: number = this.differenceCounterService.generateAngleSpinner(errorFoundCounter);
    const convertedErrorToPercent: number = this.differenceCounterService.convertErrorToPercent(errorFoundCounter);

    this.progressCircle.nativeElement.setAttribute("data-value", convertedErrorToPercent.toFixed(1));
    this.progressCircle.nativeElement.setAttribute("id", errorFoundCounter.toString());

    this.progressBar.nativeElement.style.transform = "rotate(" + angle + "deg)";

  }
}
