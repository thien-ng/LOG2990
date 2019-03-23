import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { ISceneObjectUpdate } from "../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../common/communication/iSceneObject";

@Injectable({
  providedIn: "root",
})
export class GameConnectionService {

  private gameConnected:  Subject<number>;
  private objectToUpdate: Subject<ISceneObjectUpdate<ISceneObject | IMesh>>;

  public constructor() {
    this.gameConnected  = new Subject<number>();
    this.objectToUpdate = new Subject<ISceneObjectUpdate<ISceneObject | IMesh>>();
  }

  public getGameConnectedListener(): Observable<number> {
    return this.gameConnected.asObservable();
  }

  public updateGameConnected(arenaID: number): void {
    this.gameConnected.next(arenaID);
  }

  public getObjectToUpdate(): Observable<ISceneObjectUpdate<ISceneObject | IMesh>> {
    return this.objectToUpdate;
  }

  public updateModifiedScene(objectToUpdate: ISceneObjectUpdate<ISceneObject | IMesh>): void {
    this.objectToUpdate.next(objectToUpdate);
  }

}
