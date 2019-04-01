import { TestBed } from "@angular/core/testing";
import { EndGameDialogService } from "./end-game-dialog.service";

// tslint:disable: no-floating-promises

describe("EndGameDialogService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: EndGameDialogService = TestBed.get(EndGameDialogService);
    expect(service).toBeTruthy();
  });
});
