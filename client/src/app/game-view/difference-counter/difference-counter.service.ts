import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DifferenceCounterService {
  public readonly DEGREE_CIRCLE: number = 360;
  public readonly PERCENT: number = 100;

  private maxError: number;

  public constructor() {
    // default constructor
  }

  public convertErrorToPercent(errorFoundCounter: number): number {
    return errorFoundCounter * this.PERCENT / this.maxError;
  }

  public computeAngleSpinner(errorFoundCounter: number): number {
    let angle: number;
    let convertedErrorToPercent: number;

    convertedErrorToPercent = this.convertErrorToPercent(errorFoundCounter);
    angle = convertedErrorToPercent * this.DEGREE_CIRCLE / this.PERCENT;

    return angle;
  }

  public setNbErrorMax(maxError: number): void {
    this.maxError = maxError;
  }
}
