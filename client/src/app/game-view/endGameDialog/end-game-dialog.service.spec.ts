import { TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogConfig, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { TestingImportsModule } from "src/app/testing-imports/testing-imports.module";
import { mock } from "ts-mockito";
import { EndGameDialogService } from "./end-game-dialog.service";

// tslint:disable: no-floating-promises no-any

describe("EndGameDialogService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:   [TestingImportsModule],
    providers: [
      EndGameDialogService,
      { provide: MatDialogConfig, useValue: {} },
      { provide: MatDialog, useValue: {} },
    ],
  }));

  it("should be created", () => {
    const service: EndGameDialogService = TestBed.get(EndGameDialogService);
    expect(service).toBeTruthy();
  });
});

describe("EndGameDialogService tests", () => {

  let endGameDialogService: EndGameDialogService;
  let config:               MatDialogConfig;
  let dialog:               MatDialog;
  let snackBar:             MatSnackBar;
  let router:               Router;

  beforeEach(() => {
    config    = mock(MatDialogConfig);
    dialog    = mock(MatDialog);
    snackBar  = mock(MatSnackBar);
    router    = mock(Router);

    endGameDialogService = new EndGameDialogService(config, dialog, snackBar, router);
  });

  it("is a test", () => {
    const spy: any = spyOn(endGameDialogService["snackBar"], "open");
    endGameDialogService["openSnackbar"]("help");

    expect(spy).toHaveBeenCalled();
  });
});
