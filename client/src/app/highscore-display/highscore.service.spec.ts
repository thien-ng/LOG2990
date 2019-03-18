import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Observable } from "rxjs";
import "rxjs/add/observable/of";
import { mock } from "ts-mockito";
import { HighscoreMessage } from "../../../../common/communication/highscore";
import { CardManagerService } from "../card/card-manager.service";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { HighscoreService } from "./highscore.service";

// tslint:disable:no-any no-floating-promises

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

describe("HighscoreService tests", () => {
  let   cardManagerService: CardManagerService;
  let   highscoreService:   HighscoreService;
  let   httpMock:           HttpClient;
  let   dataMock:           HighscoreMessage;
  const idMock:             number = 2;

  beforeEach(() => {
    httpMock            = mock(HttpClient);
    cardManagerService  = new CardManagerService(httpMock);
    highscoreService    = new HighscoreService(cardManagerService, httpMock);
  });

  it("should call highscoreUpdated.next() with right data value", () => {
    dataMock = {
      id:           idMock,
      timesSingle:  [{username: "cpu", time: "3:21"}, {username: "cpu", time: "3:32"}, {username: "cpu", time: "6:17"}],
      timesMulti:   [{username: "cpu", time: "3:31"}, {username: "cpu", time: "9:38"}, {username: "cpu", time: "9:42"}],
    };

    const spyNext: any = spyOn<any>(highscoreService["highscoreUpdated"], "next");

    spyOn(httpMock, "get").and.callThrough().and.returnValue(Observable.of(dataMock));
    highscoreService.getHighscore(idMock);

    expect(spyNext).toHaveBeenCalled();
  });

  it("should not call highscoreUpdated.next() with wrong seconds value in timesSingle", () => {
    dataMock = {
      id:           idMock,
      timesSingle:  [{username: "cpu", time: "3:62"}, {username: "cpu", time: "3:32"}, {username: "cpu", time: "6:17"}],
      timesMulti:   [{username: "cpu", time: "3:31"}, {username: "cpu", time: "9:38"}, {username: "cpu", time: "9:42"}],
    };

    const spyNext: any = spyOn<any>(highscoreService["highscoreUpdated"], "next");

    spyOn(httpMock, "get").and.callThrough().and.returnValue(Observable.of(dataMock));
    highscoreService.getHighscore(idMock);

    expect(spyNext).not.toHaveBeenCalled();
  });

  it("should not call highscoreUpdated.next() with wrong minutes value in timesSingle", () => {
    dataMock = {
      id:           idMock,
      timesSingle:  [{username: "cpu", time: "63:21"}, {username: "cpu", time: "3:32"}, {username: "cpu", time: "6:17"}],
      timesMulti:   [{username: "cpu", time: "3:31"}, {username: "cpu", time: "9:38"}, {username: "cpu", time: "9:42"}],
    };

    const spyNext: any = spyOn<any>(highscoreService["highscoreUpdated"], "next");

    spyOn(httpMock, "get").and.callThrough().and.returnValue(Observable.of(dataMock));
    highscoreService.getHighscore(idMock);

    expect(spyNext).not.toHaveBeenCalled();
  });

  it("should not call highscoreUpdated.next() with wrong selector in timesSingle", () => {
    dataMock = {
      id:           idMock,
      timesSingle:  [{username: "cpu", time: "3,21"}, {username: "cpu", time: "3:32"}, {username: "cpu", time: "6:17"}],
      timesMulti:   [{username: "cpu", time: "3:31"}, {username: "cpu", time: "9:38"}, {username: "cpu", time: "9:42"}],
    };

    const spyNext: any = spyOn<any>(highscoreService["highscoreUpdated"], "next");

    spyOn(httpMock, "get").and.callThrough().and.returnValue(Observable.of(dataMock));
    highscoreService.getHighscore(idMock);

    expect(spyNext).not.toHaveBeenCalled();
  });

  it("should not call highscoreUpdated.next() with wrong seconds value in timesMulti", () => {
    dataMock = {
      id:           idMock,
      timesSingle:  [{username: "cpu", time: "3:21"}, {username: "cpu", time: "3:32"}, {username: "cpu", time: "6:17"}],
      timesMulti:   [{username: "cpu", time: "3:31"}, {username: "cpu", time: "9:38"}, {username: "cpu", time: "9:62"}],
    };

    const spyNext: any = spyOn<any>(highscoreService["highscoreUpdated"], "next");

    spyOn(httpMock, "get").and.callThrough().and.returnValue(Observable.of(dataMock));
    highscoreService.getHighscore(idMock);

    expect(spyNext).not.toHaveBeenCalled();
  });

  it("should not call highscoreUpdated.next() with wrong minutes value in timesMulti", () => {
    dataMock = {
      id:           idMock,
      timesSingle:  [{username: "cpu", time: "3:21"}, {username: "cpu", time: "3:32"}, {username: "cpu", time: "6:17"}],
      timesMulti:   [{username: "cpu", time: "3:31"}, {username: "cpu", time: "9:38"}, {username: "cpu", time: "69:42"}],
    };

    const spyNext: any = spyOn<any>(highscoreService["highscoreUpdated"], "next");

    spyOn(httpMock, "get").and.callThrough().and.returnValue(Observable.of(dataMock));
    highscoreService.getHighscore(idMock);

    expect(spyNext).not.toHaveBeenCalled();
  });

  it("should not call highscoreUpdated.next() with wrong selector in timesMulti", () => {
    dataMock = {
      id:           idMock,
      timesSingle:  [{username: "cpu", time: "3:21"}, {username: "cpu", time: "3:32"}, {username: "cpu", time: "6:17"}],
      timesMulti:   [{username: "cpu", time: "3:31"}, {username: "cpu", time: "9:38"}, {username: "cpu", time: "9'42"}],
    };

    const spyNext: any = spyOn<any>(highscoreService["highscoreUpdated"], "next");

    spyOn(httpMock, "get").and.callThrough().and.returnValue(Observable.of(dataMock));
    highscoreService.getHighscore(idMock);

    expect(spyNext).not.toHaveBeenCalled();
  });

  it("should call getHighscore() when calling resetHighscore()", () => {
    const responseValueMock:  string  = "";
    const methodeSpy:         any     = spyOn(highscoreService, "getHighscore");

    spyOn<any>(highscoreService["highscoreUpdated"], "next");
    spyOn(httpMock, "get").and.callThrough().and.returnValue(Observable.of(responseValueMock));
    highscoreService.resetHighscore(idMock);

    expect(methodeSpy).toHaveBeenCalled();
  });

  it("should return an observable when calling resetHighscore()", () => {
    const returnValueMethod: Observable<HighscoreMessage> = highscoreService.getHighscoreUpdateListener();

    expect(returnValueMethod).not.toBeUndefined();
  });

  it("should call getHighscore when the highscore have been reloaded", () => {
    const spy: jasmine.Spy = spyOn(highscoreService, "getHighscore");
    cardManagerService.reloadHighscore(1);

    expect(spy).toHaveBeenCalledWith(1);
  });
});
