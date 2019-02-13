import { AfterContentInit, Component, ElementRef, Inject, ViewChild } from "@angular/core";
import { DiffCounterService } from "./diff-counter.service";
@Component({
  selector: "app-diff-counter",
  templateUrl: "./diff-counter.component.html",
  styleUrls: ["./diff-counter.component.css"],
  providers: [DiffCounterService],
})
export class DiffCounterComponent implements AfterContentInit {
  @ViewChild("progressCircle", { read: ElementRef })
  public progressCircle: ElementRef;
  @ViewChild("progressBar", { read: ElementRef })
  public progressBar: ElementRef;

  public constructor(@Inject(DiffCounterService) public diffCounterService: DiffCounterService) {
    // default constructor
  }

  public ngAfterContentInit(): void {
    this.diffCounterService = new DiffCounterService();

    this.updateSpinner(1);
  }

  public updateSpinner(nbErrorFound: number): void {
    const angle: number = this.diffCounterService.computeAngleSpinner(nbErrorFound);
    const convertedErrorToPercent: number = this.diffCounterService.convertErrorToPercent(nbErrorFound);

    this.progressCircle.nativeElement.setAttribute("data-value", convertedErrorToPercent.toFixed(1));
    this.progressCircle.nativeElement.setAttribute("id", nbErrorFound.toString());

    if (this.progressBar) {
      this.progressBar.nativeElement.style.transform = "rotate(" + angle + "deg)";
    }
  }
}
