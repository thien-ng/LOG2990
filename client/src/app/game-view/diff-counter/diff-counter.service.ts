import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DiffCounterService {
  public readonly DEGREE_CIRCLE: number = 360;
  public readonly PERCENT: number = 100;
  public readonly NB_ERROR_MAX: number = 7;

  public constructor() {
    // default constructor
  }

  public convertErrorToPercent(nbErrorFound: number): number {
    return nbErrorFound * this.PERCENT / this.NB_ERROR_MAX;
  }

  public computeAngleSpinner(nbErrorFound: number): number {
    let angle: number;
    let convertedErrorToPercent: number;

    convertedErrorToPercent = this.convertErrorToPercent(nbErrorFound);
    angle = convertedErrorToPercent * this.DEGREE_CIRCLE / this.PERCENT;

    return angle;
  }
}
