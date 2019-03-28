import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { CClient } from "../../CClient";
@Injectable({
  providedIn: "root",
})
export class DifferenceCounterService {

  private maxError:       number;
  private counterUpdated: Subject<number>;

  public constructor() {
    this.counterUpdated = new Subject<number>();
  }

  public getCounter(): Observable<number> {
    return this.counterUpdated.asObservable();
  }

  public updateCounter(newValue: number): void {
    this.counterUpdated.next(newValue);
  }

  public convertErrorToPercent(errorFoundCounter: number): number {
    return errorFoundCounter * CClient.PERCENT / this.maxError;
  }

  public generateAngleSpinner(errorFoundCounter: number): number {
    let convertedErrorToPercent: number;

    convertedErrorToPercent = this.convertErrorToPercent(errorFoundCounter);

    return convertedErrorToPercent * CClient.DEGREE_CIRCLE / CClient.PERCENT;
  }

  public setNbErrorMax(maxError: number): void {
    this.maxError = maxError;
  }
}
