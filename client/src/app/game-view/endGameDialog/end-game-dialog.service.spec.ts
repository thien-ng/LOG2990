import { TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogConfig, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { CardManagerService } from "src/app/card/card-manager.service";
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
  let cardManager:          CardManagerService;

  beforeEach(() => {
    config      = mock(MatDialogConfig);
    dialog      = mock(MatDialog);
    snackBar    = mock(MatSnackBar);
    router      = mock(Router);
    cardManager = mock(CardManagerService);

    endGameDialogService = new EndGameDialogService(config, cardManager, dialog, snackBar, router);
  });

<<<<<<< HEAD
  it("Should open the snackbar", (done: Function) => {
=======
  it("is a test", () => {
>>>>>>> parent of 107d5571... JB T: regler erreur de test sur ci
    const spy: any = spyOn(endGameDialogService["snackBar"], "open");
    endGameDialogService["openSnackbar"]("help");

    expect(spy).toHaveBeenCalled();
  });
});
