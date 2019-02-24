
import { ElementRef } from "@angular/core";
import { inject, TestBed } from "@angular/core/testing";
import { IClickMessage, IPosition2D } from "../../../../../common/communication/iGameplay";
import { GameViewSimpleService } from "./game-view-simple.service";

// tslint:disable:no-any

describe("GameViewService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [GameViewSimpleService],
  }));

  it("should set sounds", inject([GameViewSimpleService], (gameViewService: GameViewSimpleService) => {
    gameViewService.setSounds(new ElementRef<any>("url/success"), new ElementRef<any>("url/fail"));

    expect(gameViewService.successSound).toEqual("url/success");
  }));

  it("should return an IClickMessage", inject([GameViewSimpleService], (gameViewService: GameViewSimpleService) => {
    const position: IPosition2D = {
      x: 10,
      y: 15,
    };

    const arenaId: number = 1;
    const username: string = "myname";

    const clickMessage: IClickMessage = {
      position: {x: 10, y: 15},
      arenaID: 1,
      username: "myname",
    };

    const generatedClickMessage: IClickMessage = gameViewService.onCanvasClick(position, arenaId, username);

    expect(generatedClickMessage).toEqual(clickMessage);
  }));

});
