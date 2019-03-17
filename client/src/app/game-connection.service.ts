import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ISceneObjectUpdate } from "../../../common/communication/iGameplay";

@Injectable({
  providedIn: "root",
})
export class GameConnectionService {

  private gameConnected:  Subject<number>;
  private objectToUpdate: Subject<ISceneObjectUpdate>;

  public constructor() {
    this.gameConnected = new Subject<number>();
    this.objectToUpdate = new Subject<ISceneObjectUpdate>();
  }

  public getGameConnectedListener(): Observable<number> {
    return this.gameConnected.asObservable();
  }

  public updateGameConnected(arenaID: number): void {
    this.gameConnected.next(arenaID);
  }

  public getObjectToUpdate(): Observable<ISceneObjectUpdate> {
    return this.objectToUpdate;
  }

  public updateObjectToUpdate(objectToUpdate: ISceneObjectUpdate): void {
    this.objectToUpdate.next(objectToUpdate);
  }

}
