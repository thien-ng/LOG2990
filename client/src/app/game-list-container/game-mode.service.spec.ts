import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TestingImportsModule } from ".././testing-imports/testing-imports.module";
import { Router } from "@angular/router";
import { GameModeService } from "./game-mode.service";
import { mock } from "ts-mockito";

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
    const result = gameModeService.getIndex();
    expect(result).toBe(0);
  });

  // it("should be 1 if toggle, then getIndex is called", () => {
  //   const result = gameModeService.getIndex();
  //   gameModeService.toggle();
  //   gameModeService.toggle();
  //   expect(result).toBe(1);
  // });

});
