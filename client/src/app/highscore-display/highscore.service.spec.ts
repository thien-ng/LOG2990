import { TestBed } from "@angular/core/testing";

import { HighscoreService } from "./highscore.service";

describe("HighscoreService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: HighscoreService = TestBed.get(HighscoreService);
    expect(service).toBeTruthy();
  });
});
