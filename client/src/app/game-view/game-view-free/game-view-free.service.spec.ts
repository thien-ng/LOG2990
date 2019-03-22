import { inject, TestBed } from "@angular/core/testing";

import { ElementRef } from "@angular/core";
import { GameMode } from "../../../../../common/communication/iCard";
import { ActionType, IArenaResponse, ISceneObjectUpdate } from "../../../../../common/communication/iGameplay";
import { ISceneObject } from "../../../../../common/communication/iSceneObject";
import { CCommon } from "../../../../../common/constantes/cCommon";
import { GameViewFreeService } from "./game-view-free.service";

// tslint:disable:no-any no-magic-numbers no-empty
const sceneObject: ISceneObject = {
  id:         1,
  type:       1,
  position:   {x: 1, y: 2, z: 3},
  rotation:   {x: 1, y: 2, z: 3},
  color:      "#FFFFFF",
  scale:      {x: 1, y: 2, z: 3},
  hidden:     true,
};
const expectedResponse: IArenaResponse<ISceneObjectUpdate> = {
  status:             "onSuccess",
  response: {
      actionToApply:  ActionType.ADD,
      sceneObject:    sceneObject,
  },
  arenaType:          GameMode.free,
};

describe("GameViewFreeService Test", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [GameViewFreeService],
  });
});

  it("should set success sounds", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    gameViewService.setSounds(new ElementRef<any>("url/success"), new ElementRef<any>("url/fail"));

    expect(gameViewService["successSound"]).toEqual(new ElementRef<any>("url/success"));
  }));

  it("should set fail sounds", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    gameViewService.setSounds(new ElementRef<any>("url/success"), new ElementRef<any>("url/fail"));

    expect(gameViewService["failSound"]).toEqual(new ElementRef<any>("url/fail"));
  }));

  it("should play success sound when getting a success click", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    const spy: any = spyOn<any>(gameViewService, "playSuccessSound");
    const expectResponse: IArenaResponse<ISceneObjectUpdate> = {
      status:     CCommon.ON_SUCCESS,
      response:   undefined,
  };
    gameViewService.onArenaResponse(expectResponse);
    expect(spy).toHaveBeenCalled();
  }));

  it("should update modified scene on success hit", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    const spy: any = spyOn<any>(gameViewService["gameConnectionService"], "updateModifiedScene");
    const audio1: HTMLAudioElement = document.createElement("audio");
    const audio2: HTMLAudioElement = document.createElement("audio");
    const successSound: ElementRef = new ElementRef<HTMLAudioElement>(audio1);
    const failsound: ElementRef = new ElementRef<HTMLAudioElement>(audio2);
    gameViewService.setSounds(successSound, failsound);
    gameViewService.onArenaResponse(expectedResponse);
    expect(spy).toHaveBeenCalled();
  }));

  it("should not play success sound when getting a bad click", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {

    const spy: any = spyOn<any>(gameViewService, "playSuccessSound");
    const expectedFalseResponse: IArenaResponse<ISceneObjectUpdate> = {
      status:     CCommon.ON_ERROR,
      response:   undefined,
    };
    gameViewService.onArenaResponse(expectedFalseResponse);
    expect(spy).not.toHaveBeenCalled();
  }));

  it("should set position", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    gameViewService.setPosition(2, 3);
    const isSameX: boolean = gameViewService.position.x === 2;
    const isSameY: boolean = gameViewService.position.y === 3;
    expect(isSameX && isSameY).toEqual(true);
  }));

  it("should play html audio success sound on good hit", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    const audio1: HTMLAudioElement = document.createElement("audio");
    const audio2: HTMLAudioElement = document.createElement("audio");
    const successSound: ElementRef = new ElementRef<HTMLAudioElement>(audio1);
    const failsound: ElementRef = new ElementRef<HTMLAudioElement>(audio2);
    gameViewService.setSounds(successSound, failsound);
    const spy: any = spyOn(gameViewService["successSound"].nativeElement, "play");
    gameViewService.onArenaResponse(expectedResponse);
    expect(spy).toHaveBeenCalled();
  }));

  it("should play html audio fail sound when called", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    const audio1: HTMLAudioElement = document.createElement("audio");
    const audio2: HTMLAudioElement = document.createElement("audio");
    const successSound: ElementRef = new ElementRef<HTMLAudioElement>(audio1);
    const failsound: ElementRef = new ElementRef<HTMLAudioElement>(audio2);
    gameViewService.setSounds(successSound, failsound);
    const spy: any = spyOn(gameViewService["failSound"].nativeElement, "play");
    gameViewService.playFailSound();
    expect(spy).toHaveBeenCalled();
  }));

  it("should update subject right click", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    const expectedRes: boolean = true;
    gameViewService.getRightClickListener().subscribe((value: boolean) => {
      expect(value).toEqual(expectedRes);
    });
    gameViewService.updateRightClick(expectedRes);
  }));

});
