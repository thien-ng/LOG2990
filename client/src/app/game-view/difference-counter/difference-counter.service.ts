import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Constants } from "../../constants";
@Injectable({
  providedIn: "root",
})
export class DifferenceCounterService {

  private maxError: number;
  private counterUpdated: BehaviorSubject<number>;
  private counterUpdatedObservable: Observable<number>;

  public constructor() {
    this.counterUpdated = new BehaviorSubject<number>(0);
    this.counterUpdatedObservable = this.counterUpdated.asObservable();
  }

  public get counter(): Observable<number> {
    return this.counterUpdatedObservable;
  }

  public updateCounter(newValue: number): void {
    this.counterUpdated.next(newValue);
  }

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
