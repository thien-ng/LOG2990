import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

const tabIndexENUM: Readonly<{
  "2D": number;
  "3D": number;
}> = Object.freeze({ "2D": 0, "3D": 1 });

@Injectable({
  providedIn: "root",
})
export class Is2Dor3DService {

  public constructor(public router: Router) {}

  private _index: number = 0;
  private _2DUpdated: Subject<number> = new Subject<number>();

  public get2DState(): number {
    return this._index;
  }

  public get2DUpdateListener(): Observable<number> {
    return this._2DUpdated.asObservable();
  }

  public toggle(): void {
    switch (this._index) {
      case tabIndexENUM["2D"]:
        this._index = tabIndexENUM["3D"];
        break;

      case tabIndexENUM["3D"]:
        this._index = tabIndexENUM["2D"];
        break;

      default:
        break;
    }
  }

}
