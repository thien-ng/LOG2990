
import { TestBed } from "@angular/core/testing";
import { GameViewSimpleService } from "./game-view-simple.service";

// tslint:disable:no-any

describe("GameViewService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: GameViewSimpleService = TestBed.get(GameViewSimpleService);
    expect(service).toBeTruthy();
  });

});
