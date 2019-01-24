import { TestBed } from "@angular/core/testing";

import { GameListContainerService } from "./game-list-container.service";

describe("GameListContainerService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: GameListContainerService = TestBed.get(GameListContainerService);
    expect(service).toBeTruthy();
  });
});
