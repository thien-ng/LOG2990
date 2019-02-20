import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Observable } from "rxjs";
import "rxjs/add/observable/of";
import { mock } from "ts-mockito";
import { HighscoreMessage } from "../../../../common/communication/highscore";
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
  let highscoreService: HighscoreService;
  let httpMock: HttpClient;
  let dataMock: HighscoreMessage;
  const idMock: number = 2;

  beforeEach(() => {
    httpMock = mock(HttpClient);
    highscoreService = new HighscoreService(httpMock);
  });

  it("should call highscoreUpdated.next() with right data value", () => {
    dataMock = {
      id: idMock,
      timesSingle: ["3:21", "3:32", "6:17"],
      timesMulti: ["3:31", "9:38", "9:42"],
    };

    const spyNext: any = spyOn<any>(highscoreService["highscoreUpdated"], "next");

    spyOn(httpMock, "get").and.callThrough().and.returnValue(Observable.of(dataMock));
    highscoreService.getHighscore(idMock);
    expect(spyNext).toHaveBeenCalled();
  });

  it("should not call highscoreUpdated.next() with wrong time value in timesSingle", () => {
    dataMock = {
      id: 2,
      timesSingle: ["3:62", "3:32", "6:17"],
      timesMulti: ["3:31", "9:38", "9:42"],
    };

    const spyNext: any = spyOn<any>(highscoreService["highscoreUpdated"], "next");

    spyOn(httpMock, "get").and.callThrough().and.returnValue(Observable.of(dataMock));
    highscoreService.getHighscore(2);
    expect(spyNext).not.toHaveBeenCalled();
  });

  it("should not call highscoreUpdated.next() with wrong selector in timesSingle", () => {
    dataMock = {
      id: 2,
      timesSingle: ["3,21", "3:32", "6:17"],
      timesMulti: ["3:31", "9:38", "9:42"],
    };

    const spyNext: any = spyOn<any>(highscoreService["highscoreUpdated"], "next");

    spyOn(httpMock, "get").and.callThrough().and.returnValue(Observable.of(dataMock));
    highscoreService.getHighscore(2);
    expect(spyNext).not.toHaveBeenCalled();
  });

  it("should call getHighscore() when calling resetHighscore()", () => {
    const responseValueMock: string = "";
    const methodeSpy: any = spyOn(highscoreService, "getHighscore");

    spyOn<any>(highscoreService["highscoreUpdated"], "next");
    spyOn(httpMock, "get").and.callThrough().and.returnValue(Observable.of(responseValueMock));

    highscoreService.resetHighscore(idMock);
    expect(methodeSpy).toHaveBeenCalled();
  });

  it("should return an observable when calling resetHighscore()", () => {
    const returnValueMethod: Observable<HighscoreMessage> = highscoreService.getHighscoreUpdateListener();

    expect(returnValueMethod).not.toBeUndefined();
  });
});
