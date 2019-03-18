import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import "rxjs/add/observable/of";
import { mock } from "ts-mockito";
import { GameMode } from "../../../../common/communication/iCard";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { CardManagerService } from "./card-manager.service";

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
  let http:               HttpClient;
  let gameID:             number;
  let gameMode:           GameMode;

  beforeEach(() => {
    http                = mock(HttpClient);
    gameID              = 1;
    gameMode            = GameMode.simple;
    cardManagerService  = new CardManagerService(http);
  });

  it("should call http.get when calling getCards()", () => {
    http.get = jasmine.createSpy("get spy");
    cardManagerService.getCards();
    expect(http.get).toHaveBeenCalled();
  });

  it("should call http.delete when calling removeCard()", () => {
    http.delete = jasmine.createSpy("delete spy");
    cardManagerService.removeCard(gameID, gameMode);
    expect(http.delete).toHaveBeenCalled();
  });

  it("should get the gameID when a new highscore is made", () => {
    cardManagerService.getHighscoreListener().subscribe((id: number) => {
      expect(id).toBe(1);
    });

    cardManagerService.reloadHighscore(1);
  });

  it("should be notified when a card is created", () => {
    let counter: number = 0;
    cardManagerService.cardCreatedObservable.subscribe((value: boolean) => {
      if (counter !== 0) {
        expect(value).toBe(true);
      }
      counter++;
    });

    cardManagerService.updateCards(true);
  });
});
