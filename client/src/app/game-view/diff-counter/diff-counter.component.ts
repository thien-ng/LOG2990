import { AfterContentInit, Component, ElementRef, ViewChild } from "@angular/core";

@Component({
  selector: "app-diff-counter",
  templateUrl: "./diff-counter.component.html",
  styleUrls: ["./diff-counter.component.css"],
})
export class DiffCounterComponent implements AfterContentInit {
  public readonly DEGREE_CIRCLE: number = 360;
  public readonly PERCENT: number = 100;
  public readonly NB_ERROR_MAX: number = 7;

  @ViewChild("progressCircle", { read: ElementRef })
  public progressCircle: ElementRef;
  @ViewChild("progressBarre", { read: ElementRef })
  public progressBarre: ElementRef;

  private nbErrorMax: number;
  private convertedErrorToPercent: number;

  public constructor() {
    this.nbErrorMax = this.NB_ERROR_MAX;
  }

  public ngAfterContentInit(): void {
    this.updateSpinner(this.progressCircle.nativeElement, 6);
  }

  private convertValueToPercent(nbErrorFound: number): number {
    return nbErrorFound * this.PERCENT / this.nbErrorMax;
  }

  private computeAngleSpinner(nbErrorFound: number): number {
    let angle: number;
    this.convertedErrorToPercent = this.convertValueToPercent(nbErrorFound);
    angle = this.convertedErrorToPercent * this.DEGREE_CIRCLE / this.PERCENT;

    return angle;
  }
}
