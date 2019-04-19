import { ElementRef, Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { CClient } from "src/app/CClient";
import { GameConnectionService } from "src/app/game-connection.service";
import { IArenaResponse, IPosition2D, ISceneObjectUpdate } from "../../../../../common/communication/iGameplay";
import { IMesh, ISceneObject } from "../../../../../common/communication/iSceneObject";
import { CCommon } from "../../../../../common/constantes/cCommon";

const EVERY_SCENE_LOADED: number = 2;
const START_TIME:         number = 0;

@Injectable({
  providedIn: "root",
})
export class GameViewFreeService {
  private socket:               SocketIOClient.Socket;
  private nbOfSceneLoaded:      number;
  private nbSceneLoadedUpdated: Subject<number>;
  private rightClickActive:     Subject<boolean>;
  private successSound:         ElementRef;
  private failSound:            ElementRef;
  private opponentSound:        ElementRef;
  private gameWon:              ElementRef;
  private gameLost:             ElementRef;
  private music:                ElementRef;
  public  position:             IPosition2D;

  public constructor (private gameConnectionService: GameConnectionService) {
    this.nbOfSceneLoaded      = 0;
    this.rightClickActive     = new Subject<boolean>();
    this.nbSceneLoadedUpdated = new Subject<number>();
    this.rightClickActive = new Subject<boolean>();
    this.position = {x: 0, y: 0};
    this.initSceneLoadedListener();
  }

  private initSceneLoadedListener(): void {
    this.nbSceneLoadedUpdated.subscribe((arenaID: number) => {
      if (++this.nbOfSceneLoaded === EVERY_SCENE_LOADED && this.socket) {
        this.socket.emit(CCommon.ON_GAME_LOADED, arenaID);
        this.nbOfSceneLoaded = 0;
      }
    });
  }

  public setGameSocket(socket: SocketIOClient.Socket): void {
    this.socket = socket;
  }

  public updateSceneLoaded(arenaID: number): void {
    this.nbSceneLoadedUpdated.next(arenaID);
  }

  public updateRightClick(newValue: boolean): void {
    this.rightClickActive.next(newValue);
  }

  public getRightClickListener(): Observable<boolean> {
    return this.rightClickActive.asObservable();
  }

  public onArenaResponse(data: IArenaResponse<ISceneObjectUpdate<ISceneObject | IMesh>>): void {
    const isRightPlayer: boolean  = data.username === sessionStorage.getItem(CClient.USERNAME_KEY);
    if (data.status === CCommon.ON_SUCCESS) {
      if (data.response) {
        (isRightPlayer) ? this.playSuccessSound() : this.playOpponentSound();
        this.gameConnectionService.updateModifiedScene(data.response);
      }
    }
  }

  public setPosition(posX: number, posY: number): void {
    this.position.x = posX;
    this.position.y = posY;
  }

  public playMusic(): void {
    this.music.nativeElement.currentTime = 0;
    this.music.nativeElement.play();
  }

  public stopMusic(): void {
    this.music.nativeElement.currentTime = 0;
    this.music.nativeElement.pause();
  }

  public playFailSound(): void {
    this.failSound.nativeElement.currentTime = START_TIME;
    this.failSound.nativeElement.play();
  }

  public playSuccessSound(): void {
    this.successSound.nativeElement.currentTime = START_TIME;
    this.successSound.nativeElement.play();
  }

  public playWinSound(): void {
    this.gameWon.nativeElement.currentTime = START_TIME;
    this.gameWon.nativeElement.play();
  }

  public playLossSound(): void {
    this.gameLost.nativeElement.currentTime = START_TIME;
    this.gameLost.nativeElement.play();
  }

  private playOpponentSound(): void {
    this.opponentSound.nativeElement.currentTime = START_TIME;
    this.opponentSound.nativeElement.play();
  }

  public setSounds(
                    success: ElementRef, fail: ElementRef, opponentSound: ElementRef,
                    gameWon: ElementRef, gameLost: ElementRef, music: ElementRef): void {
    this.successSound   = success;
    this.failSound      = fail;
    this.opponentSound  = opponentSound;
    this.gameWon        = gameWon;
    this.gameLost       = gameLost;
    this.music          = music;
  }

}
