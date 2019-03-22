import { inject, TestBed } from "@angular/core/testing";

import { ElementRef } from "@angular/core";
import { GameMode } from "../../../../../common/communication/iCard";
import { ActionType, IArenaResponse, ISceneObjectUpdate } from "../../../../../common/communication/iGameplay";
import { ISceneObject } from "../../../../../common/communication/iSceneObject";
import { CCommon } from "../../../../../common/constantes/cCommon";
import { GameViewFreeService } from "./game-view-free.service";

// tslint:disable:no-any no-magic-numbers no-empty
const sceneObject: ISceneObject = {
  id:         1,
  type:       1,
  position:   {x: 1, y: 2, z: 3},
  rotation:   {x: 1, y: 2, z: 3},
  color:      "#FFFFFF",
  scale:      {x: 1, y: 2, z: 3},
  hidden:     true,
};
const expectedResponse: IArenaResponse<ISceneObjectUpdate> = {
  status:             "onSuccess",
  response: {
      actionToApply:  ActionType.ADD,
      sceneObject:    sceneObject,
  },
  arenaType:          GameMode.free,
};

describe("GameViewFreeService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [GameViewFreeService],
  });
});

});
