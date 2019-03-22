
import { ElementRef } from "@angular/core";
import { inject, TestBed } from "@angular/core/testing";
import { mock } from "ts-mockito";
import { IArenaResponse, IClickMessage, IOriginalPixelCluster, IPosition2D } from "../../../../../common/communication/iGameplay";
import { CCommon } from "../../../../../common/constantes/cCommon";
import { GameViewSimpleService } from "./game-view-simple.service";

// tslint:disable:no-any no-magic-numbers no-empty
const hitPosition: IPosition2D = {
  x: 1,
  y: 1,
};

const expectedPixelClusters: IOriginalPixelCluster = {
  differenceKey:  1,
  cluster: [
      {
          color: {
              R: 100,
              G: 100,
              B: 100,
          },
          position: hitPosition,
      },
  ],
};

describe("GameViewSimpleService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [GameViewSimpleService],
  });
});

  it("should set success sounds", inject([GameViewSimpleService], (gameViewService: GameViewSimpleService) => {
    gameViewService.setSounds(new ElementRef<any>("url/success"), new ElementRef<any>("url/fail"));

    expect(gameViewService["successSound"]).toEqual(new ElementRef<any>("url/success").nativeElement);
  }));

  it("should set fail sounds", inject([GameViewSimpleService], (gameViewService: GameViewSimpleService) => {
    gameViewService.setSounds(new ElementRef<any>("url/success"), new ElementRef<any>("url/fail"));

    expect(gameViewService["failSound"]).toEqual(new ElementRef<any>("url/fail").nativeElement);
  }));

  it("should set modified canvas", inject([GameViewSimpleService], (gameViewService: GameViewSimpleService) => {
    const canvas: CanvasRenderingContext2D = mock(CanvasRenderingContext2D);
    gameViewService.setCanvas(canvas);

    expect(gameViewService["canvasModified"]).toEqual(canvas);
  }));

  it("should return an IClickMessage", inject([GameViewSimpleService], (gameViewService: GameViewSimpleService) => {
    const position: IPosition2D = {
      x:    10,
      y:    15,
    };

    const arenaId:  number = 1;
    const username: string = "myname";

    const clickMessage: IClickMessage<IPosition2D> = {
      value:   {
        x: 10,
        y: 15,
      },
      arenaID:    1,
      username:   "myname",
    };

    const generatedClickMessage: IClickMessage<IPosition2D> = gameViewService.onCanvasClick(position, arenaId, username);

    expect(generatedClickMessage).toEqual(clickMessage);
  }));

  it("should play success sound when getting a success click", inject([GameViewSimpleService], (gameViewService: GameViewSimpleService) => {
    const canvas: CanvasRenderingContext2D = mock(CanvasRenderingContext2D);
    gameViewService.setCanvas(canvas);
    gameViewService.setSounds(mock(ElementRef), mock(ElementRef));
    const spy: any = spyOn<any>(gameViewService, "playSuccessSound");
    const expectedResponse: IArenaResponse<IOriginalPixelCluster> = {
      status:     CCommon.ON_SUCCESS,
      response:   undefined,
  };
    gameViewService.onArenaResponse(expectedResponse);
    expect(spy).toHaveBeenCalled();
  }));
});
