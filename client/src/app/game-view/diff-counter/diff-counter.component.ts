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
  @ViewChild("progressBar", { read: ElementRef })
  public progressBar: ElementRef;

  private convertedErrorToPercent: number;

  public constructor() {
    // default constructor
  }

  public ngAfterContentInit(): void {
    this.updateSpinner(this.progressCircle.nativeElement, 4);
  }

  public updateSpinner(elem: HTMLElement, nbErrorFound: number): void {
    const angle: number = this.computeAngleSpinner(nbErrorFound);
    elem.setAttribute("data-value", this.convertedErrorToPercent.toString());
    elem.setAttribute("id", nbErrorFound.toString());

    if (this.progressBar.nativeElement) {
      this.progressBar.nativeElement.style.transform = "rotate(" + angle + "deg)";
    }
  }

  private convertErrorToPercent(nbErrorFound: number): number {
    return nbErrorFound * this.PERCENT / this.NB_ERROR_MAX;
  }

  private computeAngleSpinner(nbErrorFound: number): number {
    let angle: number;
    this.convertedErrorToPercent = this.convertErrorToPercent(nbErrorFound);
    angle = this.convertedErrorToPercent * this.DEGREE_CIRCLE / this.PERCENT;

    return angle;
  }
}
