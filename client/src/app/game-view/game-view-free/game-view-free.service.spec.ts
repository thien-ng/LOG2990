import { TestBed } from "@angular/core/testing";

import { GameViewFreeService } from "./game-view-free.service";

describe("GameViewFreeService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: GameViewFreeService = TestBed.get(GameViewFreeService);
    expect(service).toBeTruthy();
  });
});
