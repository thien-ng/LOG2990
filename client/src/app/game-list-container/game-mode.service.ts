import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, Subject } from "rxjs";

const INDEX_2D: number = 0;
const INDEX_3D: number = 1;

@Injectable({
  providedIn: "root",
})
export class GameModeService {

  public constructor(
    public router: Router,
    private gameModeUpdated: Subject<number>,
    private index: number,
    ) {
      gameModeUpdated = new Subject<number>();
      index = 0;
    }

  public getIndex(): number {
    return this.index;
  }

  public getGameModeUpdateListener(): Observable<number> {
    return this.gameModeUpdated.asObservable();
  }

  public toggle(): void {
    switch (this.index) {
      case INDEX_2D:
        this.index = INDEX_3D;
        break;

      case INDEX_3D:
        this.index = INDEX_2D;
        break;

      default:
        break;
    }
  }
}
