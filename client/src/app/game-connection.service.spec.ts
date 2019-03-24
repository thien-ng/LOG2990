import { TestBed } from "@angular/core/testing";

import { ActionType, ISceneObjectUpdate } from "../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../common/communication/iSceneObject";
import { GameConnectionService } from "./game-connection.service";

describe("GameConnectionService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: GameConnectionService = TestBed.get(GameConnectionService);
    expect(service).toBeTruthy();
  });

  it("should send the arena id through subjects", () => {
    const service: GameConnectionService = TestBed.get(GameConnectionService);
    service.getGameConnectedListener().subscribe((newID: number) => {
      expect(newID).toBe(1);
    });
    service.updateGameConnected(1);
  });

  it("should send the object to update through subjects", () => {
    const service:        GameConnectionService = TestBed.get(GameConnectionService);
    const objectToUpdate: ISceneObjectUpdate<ISceneObject | IMesh>    = {actionToApply: ActionType.ADD};

    service.getObjectToUpdate().subscribe((object: ISceneObjectUpdate<ISceneObject | IMesh>) => {
      expect(object).toBe(objectToUpdate);
    });
    service.updateModifiedScene(objectToUpdate);
  });

});
