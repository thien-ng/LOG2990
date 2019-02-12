import { ElementRef, Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DiffCounterService {
  public readonly DEGREE_CIRCLE: number = 360;
  public readonly PERCENT: number = 100;
  public readonly NB_ERROR_MAX: number = 7;

  public progressCircle: ElementRef;
  public progressBar: ElementRef;

  private convertedErrorToPercent: number;

  public constructor(progressCircle: ElementRef, progressBar: ElementRef) {
    this.progressCircle = progressCircle;
    this.progressBar = progressBar;
  }

  public updateSpinner(elem: HTMLElement, nbErrorFound: number): void {
    const angle: number = this.computeAngleSpinner(nbErrorFound);
    elem.setAttribute("data-value", this.convertedErrorToPercent.toFixed(1));
    elem.setAttribute("id", nbErrorFound.toString());

    if (this.progressBar) {
      this.progressBar.style.transform = "rotate(" + angle + "deg)";
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
