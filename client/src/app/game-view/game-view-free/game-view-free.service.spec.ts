import { inject, TestBed } from "@angular/core/testing";

import { ElementRef } from "@angular/core";
import * as io from "socket.io-client";
import { CClient } from "src/app/CClient";
import { mock } from "ts-mockito";
import { GameMode } from "../../../../../common/communication/iCard";
import { ActionType, IArenaResponse, ISceneObjectUpdate } from "../../../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../../../common/communication/iSceneObject";
import { CCommon } from "../../../../../common/constantes/cCommon";
import { GameViewFreeService } from "./game-view-free.service";

// tslint:disable: no-any no-magic-numbers no-empty max-line-length no-floating-promises

const sceneObject: ISceneObject = {
  id:         1,
  type:       1,
  position:   {x: 1, y: 2, z: 3},
  rotation:   {x: 1, y: 2, z: 3},
  color:      "#FFFFFF",
  scale:      {x: 1, y: 2, z: 3},
  hidden:     true,
};
const expectedResponse: IArenaResponse<ISceneObjectUpdate<ISceneObject | IMesh>> = {
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

    let store: any = {};
    const mockLocalStorage: any = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };

    spyOn(sessionStorage, "getItem")
    .and.callFake(mockLocalStorage.getItem);
    spyOn(sessionStorage, "setItem")
    .and.callFake(mockLocalStorage.setItem);

    sessionStorage.setItem(CClient.USERNAME_KEY, "mike");
});

  it("should set success sound with value passed by parameter", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    gameViewService.setSounds(new ElementRef<any>("url/success"), new ElementRef<any>("url/fail"), new ElementRef<any>("url/opp"), new ElementRef<any>("url/won"), new ElementRef<any>("url/lost"), new ElementRef<any>("url/music"));

    expect(gameViewService["successSound"]).toEqual(new ElementRef<any>("url/success"));
  }));

  it("should set fail sound with value passed by parameter", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    gameViewService.setSounds(new ElementRef<any>("url/success"), new ElementRef<any>("url/fail"), new ElementRef<any>("url/opp"), new ElementRef<any>("url/won"), new ElementRef<any>("url/lost"), new ElementRef<any>("url/music"));

    expect(gameViewService["failSound"]).toEqual(new ElementRef<any>("url/fail"));
  }));

  it("should play success sound when getting a success click", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    const spy: any = spyOn<any>(gameViewService, "playSuccessSound");
    const expectResponse: IArenaResponse<ISceneObjectUpdate<ISceneObject | IMesh>> = {
      status:     CCommon.ON_SUCCESS,
      response:   {
        actionToApply:  ActionType.ADD,
        sceneObject:    sceneObject,
      },
      username:   "mike",
  };
    gameViewService.onArenaResponse(expectResponse);
    expect(spy).toHaveBeenCalled();
  }));

  it("should update modified scene on success hit", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    const spy: any = spyOn<any>(gameViewService["gameConnectionService"], "updateModifiedScene");
    const audio1: HTMLAudioElement = document.createElement("audio");
    const sound: ElementRef = new ElementRef<HTMLAudioElement>(audio1);
    gameViewService.setSounds(sound, sound, sound, sound, sound, sound);
    gameViewService.onArenaResponse(expectedResponse);
    expect(spy).toHaveBeenCalled();
  }));

  it("should not play success sound when getting a bad click", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {

    const spy: any = spyOn<any>(gameViewService, "playSuccessSound");
    const expectedFalseResponse: IArenaResponse<ISceneObjectUpdate<ISceneObject | IMesh>> = {
      status:     CCommon.ON_ERROR,
      response:   undefined,
    };
    gameViewService.onArenaResponse(expectedFalseResponse);
    expect(spy).not.toHaveBeenCalled();
  }));


  it("should play background music when called", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    const audio1: HTMLAudioElement = document.createElement("audio");
    const sound: ElementRef = new ElementRef<HTMLAudioElement>(audio1);
    gameViewService.setSounds(sound, sound, sound, sound, sound, sound);
    const spy: any = spyOn(gameViewService["music"].nativeElement, "play");
    gameViewService.playMusic();
    expect(spy).toHaveBeenCalled();
  }));

  it("should pause background music when called", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    const audio1: HTMLAudioElement = document.createElement("audio");
    const sound: ElementRef = new ElementRef<HTMLAudioElement>(audio1);
    gameViewService.setSounds(sound, sound, sound, sound, sound, sound);
    const spy: any = spyOn(gameViewService["music"].nativeElement, "pause");
    gameViewService.stopMusic();
    expect(spy).toHaveBeenCalled();
  }));

  it("should set position of gameViewService", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    gameViewService.setPosition(2, 3);
    const isSameX: boolean = gameViewService.position.x === 2;
    const isSameY: boolean = gameViewService.position.y === 3;
    expect(isSameX && isSameY).toEqual(true);
  }));

  it("should play html audio success sound on good hit", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    const audio1: HTMLAudioElement = document.createElement("audio");
    const sound: ElementRef = new ElementRef<HTMLAudioElement>(audio1);
    gameViewService.setSounds(sound, sound, sound, sound, sound, sound);
    const spy: any = spyOn(gameViewService["successSound"].nativeElement, "play");
    gameViewService.onArenaResponse(expectedResponse);
    expect(spy).toHaveBeenCalled();
  }));

  it("should play html audio fail sound when called", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    const audio1: HTMLAudioElement = document.createElement("audio");
    const audio2: HTMLAudioElement = document.createElement("audio");
    const successSound: ElementRef = new ElementRef<HTMLAudioElement>(audio1);
    const failsound: ElementRef = new ElementRef<HTMLAudioElement>(audio2);
    gameViewService.setSounds(successSound, failsound, mock(ElementRef), mock(ElementRef), mock(ElementRef), mock(ElementRef));
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

  it("should update number of sceneLoaded ", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    const arenaID: number = 20;
    gameViewService.updateSceneLoaded(arenaID);
    expect(gameViewService["nbOfSceneLoaded"]).toEqual(1);
  }));

  it("should reset the number of sceneLoaded ", inject([GameViewFreeService], (gameViewService: GameViewFreeService) => {
    const arenaID: number = 20;
    gameViewService["socket"] =  io(CClient.WEBSOCKET_URL);
    spyOn(gameViewService["socket"], "emit").and.returnValue(() => {});
    gameViewService.updateSceneLoaded(arenaID);
    gameViewService.updateSceneLoaded(arenaID);
    expect(gameViewService["nbOfSceneLoaded"]).toEqual(0);
  }));

});
