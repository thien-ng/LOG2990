import { ElementRef, Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Constants } from "src/app/constants";
import { GameConnectionService } from "src/app/game-connection.service";
import { IArenaResponse, IPosition2D, ISceneObjectUpdate } from "../../../../../common/communication/iGameplay";
import { CCommon } from "../../../../../common/constantes/cCommon";

const EVERY_SCENE_LOADED: number = 2;

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
  private textCanvasOriginal:   HTMLDivElement;
  private textCanvasModified:   HTMLDivElement;
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

  public onArenaResponse(data: IArenaResponse<ISceneObjectUpdate>): void {

    if (data.status === CCommon.ON_SUCCESS) {

      this.playSuccessSound();
      if (data.response) {
        this.gameConnectionService.updateModifiedScene(data.response);
      }
    }
  }

  public setPosition(mouseEvent: MouseEvent): void {
    this.position.x = mouseEvent.offsetX;
    this.position.y = mouseEvent.offsetY;
  }

  public wrongClickRoutine(): void {
    this.playFailSound();
    this.disableClickRoutine();
  }

  public enableClickRoutine(): void {
    document.body.style.cursor          = "auto";
    this.textCanvasOriginal.textContent = null;
    this.textCanvasModified.textContent = null;
  }

  private disableClickRoutine(): void {
      document.body.style.cursor  = "not-allowed";
      const positionTop:   number = this.position.y - Constants.CENTERY;
      const positionRight: number = this.position.x - Constants.CENTERX;

      this.textCanvasOriginal.style.top   = positionTop   + "px";
      this.textCanvasOriginal.style.left  = positionRight + "px";
      this.textCanvasModified.style.top   = positionTop   + "px";
      this.textCanvasModified.style.left  = positionRight + "px";
      this.textCanvasOriginal.textContent = Constants.ERROR_MESSAGE;
      this.textCanvasModified.textContent = Constants.ERROR_MESSAGE;
  }

  private playFailSound(): void {
    this.failSound.nativeElement.currentTime = 0;
    this.failSound.nativeElement.play();
  }

  private playSuccessSound(): void {
    this.successSound.nativeElement.currentTime = 0;
    this.successSound.nativeElement.play();
  }

  public setSounds(success: ElementRef, fail: ElementRef): void {
    this.successSound = success;
    this.failSound    = fail;
  }

  public setText(text1: ElementRef, text2: ElementRef): void {
    this.textCanvasOriginal = text1.nativeElement;
    this.textCanvasModified = text2.nativeElement;
  }

}
