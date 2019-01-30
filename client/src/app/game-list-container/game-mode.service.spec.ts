import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TestingImportsModule } from ".././testing-imports/testing-imports.module";

import { GameModeService } from "./game-mode.service";

describe("GameModeService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [GameModeService],
    imports: [
      RouterTestingModule,
      TestingImportsModule,
    ],
  }));

  it("should be created", () => {
    const service: GameModeService = TestBed.get(GameModeService);
    expect(service).toBeTruthy();
  });
});
