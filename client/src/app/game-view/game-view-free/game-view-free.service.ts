import { Injectable } from "@angular/core";
import { IArenaResponse, ISceneObjectUpdate, ActionType } from "../../../../../common/communication/iGameplay";
import { ISceneVariables } from "../../../../../common/communication/iSceneVariables";
import { CCommon } from "../../../../../common/constantes/cCommon";
import { ISceneObject } from "../../../../../common/communication/iSceneObject";

@Injectable({
  providedIn: "root",
})
export class GameViewFreeService {

  private  modifiedVariables: ISceneVariables;
  
  public setScenesVarialbles(modifiedVariables: ISceneVariables): void {
    this.modifiedVariables = modifiedVariables;
  }

  public onArenaResponse(data: IArenaResponse<ISceneObjectUpdate>): void {

    if (data.status === CCommon.ON_ERROR) {
      return;
    }

    // this.playSuccessSound();
    if (data.response) {
      this.updateScenesVariables(data.response);
    }
  }

  private updateScenesVariables(updateObjectAction: ISceneObjectUpdate): void {

    switch (updateObjectAction.actionToApply) {

      case ActionType.ADD:
        this.addObject(updateObjectAction.sceneObject);
        break;

      case ActionType.DELETE:
        this.deleteObject(updateObjectAction.sceneObject);
        break;

      case ActionType.CHANGE_COLOR:
        this.changeObjectColor(updateObjectAction.sceneObject);
        break;

      default:
        break;
    }
  }

  private addObject(sceneObject: ISceneObject | undefined): void {

    const listObjects: ISceneObject[] = this.modifiedVariables.sceneObjects;

    if (sceneObject) {
      listObjects.push(sceneObject);
    }
  }

  private deleteObject(sceneObject: ISceneObject | undefined): void {

    let listObjects: ISceneObject[] = this.modifiedVariables.sceneObjects;

    if (sceneObject) {
      listObjects = listObjects.filter(object => object !== sceneObject);
    }
  }

  private changeObjectColor(sceneObject: ISceneObject | undefined): void {
    
    let listObjects: ISceneObject[] = this.modifiedVariables.sceneObjects;

    if (sceneObject) {
      listObjects.forEach((object: ISceneObject) => {
        if (object.id === sceneObject.id) {
          object.color = sceneObject.color;
        }
      });
    }
  }

  public wrongClickRoutine(): void {
    // _TODO
  }

  public enableClickRoutine(): void {
    // _TODO
  }

}
