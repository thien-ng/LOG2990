import { Injectable } from "@angular/core";
import { Constants } from "../../constants";
@Injectable({
  providedIn: "root",
})
export class DifferenceCounterService {

  private maxError: number;

  public convertErrorToPercent(errorFoundCounter: number): number {
    return errorFoundCounter * Constants.PERCENT / this.maxError;
  }

  public generateAngleSpinner(errorFoundCounter: number): number {
    let convertedErrorToPercent: number;

    convertedErrorToPercent = this.convertErrorToPercent(errorFoundCounter);

    return convertedErrorToPercent * Constants.DEGREE_CIRCLE / Constants.PERCENT;
  }

  public setNbErrorMax(maxError: number): void {
    this.maxError = maxError;
  }
}
