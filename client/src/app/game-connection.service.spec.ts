import { TestBed } from "@angular/core/testing";

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
});
