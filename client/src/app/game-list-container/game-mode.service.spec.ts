import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { GameModeService } from "./game-mode.service";

describe("Is2Dor3DService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [GameModeService],
    imports: [
      RouterTestingModule,
    ],
  }));

  it("should be created", () => {
    const service: GameModeService = TestBed.get(GameModeService);
    expect(service).toBeTruthy();
  });
});
