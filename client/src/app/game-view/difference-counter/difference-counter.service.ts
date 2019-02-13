import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DifferenceCounterService {
  public readonly DEGREE_CIRCLE: number = 360;
  public readonly PERCENT: number = 100;

  private nbErrorMax: number;

  public constructor() {
    // default constructor
  }

  public convertErrorToPercent(nbErrorFound: number): number {
    return nbErrorFound * this.PERCENT / this.nbErrorMax;
  }

  public computeAngleSpinner(nbErrorFound: number): number {
    let angle: number;
    let convertedErrorToPercent: number;

    convertedErrorToPercent = this.convertErrorToPercent(nbErrorFound);
    angle = convertedErrorToPercent * this.DEGREE_CIRCLE / this.PERCENT;

    return angle;
  }

  public setNbErrorMax(nbErrorMax: number): void {
    this.nbErrorMax = nbErrorMax;
  }
}
