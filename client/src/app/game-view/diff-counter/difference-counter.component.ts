import { AfterContentInit, Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { DiffCounterService } from "./diff-counter.service";
@Component({
  selector: "app-difference-counter",
  templateUrl: "./difference-counter.component.html",
  styleUrls: ["./difference-counter.component.css"],
  providers: [DiffCounterService],
})
export class DifferenceCounterComponent implements AfterContentInit {
  public readonly DEFAULT_NB_ERROR_FOUND: number = 0;
  public readonly DEFAULT_NB_ERROR_MAX: number = 7;

  @ViewChild("progressCircle", { read: ElementRef })
  public progressCircle: ElementRef;
  @ViewChild("progressBar", { read: ElementRef })
  public progressBar: ElementRef;

  public constructor(@Inject(DiffCounterService) public diffCounterService: DiffCounterService) {}

  public ngAfterContentInit(): void {
    this.diffCounterService.setNbErrorMax(this.DEFAULT_NB_ERROR_MAX);
    this.updateSpinner(this.DEFAULT_NB_ERROR_FOUND);
  }

  public updateSpinner(nbErrorFound: number): void {
    const angle: number = this.diffCounterService.computeAngleSpinner(nbErrorFound);
    const convertedErrorToPercent: number = this.diffCounterService.convertErrorToPercent(nbErrorFound);

    this.progressCircle.nativeElement.setAttribute("data-value", convertedErrorToPercent.toFixed(1));
    this.progressCircle.nativeElement.setAttribute("id", nbErrorFound.toString());

    this.progressBar.nativeElement.style.transform = "rotate(" + angle + "deg)";

  }
}
