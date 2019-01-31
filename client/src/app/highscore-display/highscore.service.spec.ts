import { TestBed } from "@angular/core/testing";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { HighscoreService } from "./highscore.service";

describe("HighscoreService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      TestingImportsModule,
    ],
    providers: [
      HighscoreService,
    ],
  }));

  it("should be created", () => {
    const service: HighscoreService = TestBed.get(HighscoreService);
    expect(service).toBeTruthy();
  });
});
