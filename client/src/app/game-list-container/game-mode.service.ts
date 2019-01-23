import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

const TAB_INDEX_ENUM: Readonly<{
  "2D": number;
  "3D": number;
}> = Object.freeze({ "2D": 0, "3D": 1 });

@Injectable({
  providedIn: "root",
})
export class GameModeService {

  public constructor(public router: Router) {}

  private _index: number = 0;
  private _gameModeUpdated: Subject<number> = new Subject<number>();

  public getIndex(): number {
    return this._index;
  }

  public getGameModeUpdateListener(): Observable<number> {
    return this._gameModeUpdated.asObservable();
  }

  public toggle(): void {
    switch (this._index) {
      case TAB_INDEX_ENUM["2D"]:
        this._index = TAB_INDEX_ENUM["3D"];
        break;

      case TAB_INDEX_ENUM["3D"]:
        this._index = TAB_INDEX_ENUM["2D"];
        break;

    // default for lint
      default:
        break;
    }
  }

}
