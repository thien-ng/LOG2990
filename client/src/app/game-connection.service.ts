import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GameConnectionService {

  private gameConnected: Subject<number>;

  public constructor() {
    this.gameConnected = new Subject<number>();
  }

  public getGameConnectedListener(): Observable<number> {
    return this.gameConnected.asObservable();
  }

  public updateGameConnected(arenaID: number): void {
    this.gameConnected.next(arenaID);
  }
}
