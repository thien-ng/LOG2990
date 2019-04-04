import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { INewScore } from "../../../../../common/communication/iGameplay";
import { CClient } from "../../CClient";
@Injectable({
  providedIn: "root",
})
export class DifferenceCounterService {

  private maxError:       number;
  private counterUpdated: Subject<INewScore>;

  public constructor() {
    this.counterUpdated = new Subject<INewScore>();
  }

  public getCounter(): Observable<INewScore> {
    return this.counterUpdated.asObservable();
  }

  public updateCounter(newValue: INewScore): void {
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
