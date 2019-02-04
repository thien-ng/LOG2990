import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { mock } from "ts-mockito";
import { TestingImportsModule } from ".././testing-imports/testing-imports.module";
import { GameModeService } from "./game-mode.service";

// tslint:disable:no-magic-numbers

let gameModeService: GameModeService;
let router: Router;

fdescribe("GameModeService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [GameModeService],
    imports: [
      RouterTestingModule,
      TestingImportsModule,
    ],
  }));

  beforeEach(() => {
    router = mock(Router);
    gameModeService = new GameModeService(router);
  });

  it("should be created", () => {
    const service: GameModeService = TestBed.get(GameModeService);
    expect(service).toBeTruthy();
  });

  it("should be 0 if getIndex is called", () => {
    const result: number = gameModeService.getIndex();
    expect(result).toBe(0);
  });

  it("should be 1 if toggle, when getIndex is called", () => {
    gameModeService.toggle();
    const result: number = gameModeService.getIndex();
    expect(result).toBe(1);
  });

  it("should be 0 if toggle twice, when getIndex is called", () => {
    gameModeService.toggle();
    gameModeService.toggle();
    const result: number = gameModeService.getIndex();
    expect(result).toBe(0);
  });

  it("should not change index if doesnt correspond to any case", () => {
    gameModeService["index"] = 2;
    expect(gameModeService.getIndex()).toBe(2);
  });

  it("should update the index after suscribe", () => {
    gameModeService.getGameModeUpdateListener()
    .subscribe((value: number) => {
      expect(value).toBe(1);
    });
    gameModeService.toggle();
  });
});
