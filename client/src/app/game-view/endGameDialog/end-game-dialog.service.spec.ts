import { TestBed } from "@angular/core/testing";
import { MatDialog, MatDialogConfig, MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { CClient } from "src/app/CClient";
import { CardManagerService } from "src/app/card/card-manager.service";
import { TestingImportsModule } from "src/app/testing-imports/testing-imports.module";
import { mock } from "ts-mockito";
import { Mode } from "../../../../../common/communication/highscore";
import { INewGameInfo } from "../../../../../common/communication/iGameplay";
import { EndGameDialogService } from "./end-game-dialog.service";

// tslint:disable: no-floating-promises no-any
const newGame: INewGameInfo = {
  type: Mode.Multiplayer,
  gameID: 1,
  path: CClient.GAME_VIEW_SIMPLE_PATH,
};

fdescribe("EndGameDialogService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports:   [TestingImportsModule],
    providers: [
      EndGameDialogService,
      { provide: MatDialogConfig, useValue: {} },
      { provide: MatDialog, useValue: {} },
    ],
  }));

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
    router      = TestBed.get(Router);
    router.initialNavigation();
    cardManager = mock(CardManagerService);

    endGameDialogService = new EndGameDialogService(config, cardManager, dialog, snackBar, router);
  });

  it("should be created", () => {
    const service: EndGameDialogService = TestBed.get(EndGameDialogService);
    expect(service).toBeTruthy();
  });

  it("should navigate to gameList", () => {
    spyOn<any>(endGameDialogService["router"], "navigate").and.returnValue(Observable.of("true")).and.callThrough();

    endGameDialogService["notifyCardDeleted"]();

    expect(endGameDialogService["router"].navigate).toHaveBeenCalledWith([CClient.GAMELIST_REDIRECT]);
  });
  it("Should open the snackbar", (done: Function) => {
    const spy: any = spyOn(endGameDialogService["snackBar"], "open");
    endGameDialogService["openSnackbar"]("help");

    expect(spy).toHaveBeenCalled();
    done();
  });
});
