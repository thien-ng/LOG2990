
import { TestBed } from "@angular/core/testing";

import { GameViewService } from "./game-view.service";

describe("GameViewService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: GameViewService = TestBed.get(GameViewService);
    expect(service).toBeTruthy();
  });
});
