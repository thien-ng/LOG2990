import { Inject, Injectable } from "@angular/core";
import * as THREE from "three";
import { IPosition2D, ISceneObjectUpdate } from "../../../../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../../../../common/communication/iSceneObject";
import { ISceneVariables } from "../../../../../../common/communication/iSceneVariables";
import { Constants } from "../../../constants";
import { GameViewFreeService } from "../game-view-free.service";
import { ThreejsMovement } from "./utilitaries/threejs-movement";
import { ThreejsRaycast } from "./utilitaries/threejs-raycast";
import { ThreejsThemeGenerator } from "./utilitaries/threejs-themeGenerator";

enum KEYS {
  W     = "w",
  A     = "a",
  S     = "s",
  D     = "d",
  T     = "t",
}

@Injectable()
export class ThreejsThemeViewService {

  public onKeyDown(keyboardEvent: KeyboardEvent): void {

    const keyValue: string = keyboardEvent.key.toLowerCase();

    switch ( keyValue ) {
      case KEYS.W:
        this.setupFront(-1);
        this.moveForward  = true;
        break;

      case KEYS.A:
        this.moveLeft     = true;
        break;

      case KEYS.S:
        this.setupFront(1);
        this.moveBackward = true;
        break;

      case KEYS.D:
        this.moveRight    = true;
        break;

      default:
        break;
    }
  }

}
