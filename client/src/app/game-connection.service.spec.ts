import { TestBed } from "@angular/core/testing";

import { GameConnectionService } from "./game-connection.service";
import { ISceneObjectUpdate, ActionType } from "../../../common/communication/iGameplay";

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
    const service: GameConnectionService = TestBed.get(GameConnectionService);
    const objectToUpdate: ISceneObjectUpdate = {actionToApply: ActionType.ADD};
    service.getObjectToUpdate().subscribe((object: ISceneObjectUpdate) => {
      expect(object).toBe(objectToUpdate);
    });
    service.updateObjectToUpdate(objectToUpdate);
  });

});
