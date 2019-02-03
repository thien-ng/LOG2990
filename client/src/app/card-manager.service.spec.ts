import { TestBed } from "@angular/core/testing";
import "rxjs/add/observable/of";

import { HttpClient } from "@angular/common/http";
import { mock } from "ts-mockito";
import { GameMode } from "../../../common/communication/iCard";
import { CardManagerService } from "./card-manager.service";
import { TestingImportsModule } from "./testing-imports/testing-imports.module";

describe("CardManager.ServiceService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [TestingImportsModule],
  }));

  it("should be created", () => {
    const service: CardManagerService = TestBed.get(CardManagerService);
    expect(service).toBeTruthy();
  });
});

describe("Card-manager tests", () => {
  let cardManagerService: CardManagerService;
  let http: HttpClient;
  let cardId: number;
  let gameMode: GameMode;

  beforeEach(() => {
    http = mock(HttpClient);
    cardId = 1;
    gameMode = GameMode.simple;
    cardManagerService = new CardManagerService(http);
  });

  it("should call http.get when calling getCards()", () => {
    http.get = jasmine.createSpy("get spy");
    cardManagerService.getCards();
    expect(http.get).toHaveBeenCalled();
  });

  it("should call http.delete when calling removeCard()", () => {
    http.delete = jasmine.createSpy("delete spy");
    cardManagerService.removeCard(cardId, gameMode);
    expect(http.delete).toHaveBeenCalled();
  });
});
