import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { CardDeleted } from "../../../../common/communication/iCard";
import { Message } from "../../../../common/communication/message";
import { CCommon } from "../../../../common/constantes/cCommon";
import { CClient } from "../CClient";
import { SocketService } from "../websocket/socket.service";

const SUCCESS_MESSAGE:  string = "Attente annulée";
const ERROR_MESSAGE:    string = "Impossible d'annuler l'attente";
const GO_MESSAGE:       string = "GO!";
const COUNTDOWN_START:  number = 3;

@Component({
  selector: "app-waiting-room",
  templateUrl: "./waiting-room.component.html",
  styleUrls: ["./waiting-room.component.css"],
})
export class WaitingRoomComponent {

  @ViewChild("countdownSound",  {read: ElementRef})  public countdownSound: ElementRef;

  @Input() private gameID:            string | null;
  @Input() public isMultiplayer:      boolean;

  public readonly CANCEL_BUTTON_TEXT: string = "Retourner à la liste de jeu";
  public readonly LOBBY_MESSAGE:      string = "En attente d'un autre joueur";
  public readonly VSIMAGE:            string = CClient.PATH_TO_IMAGES + "/versus.png";
  public readonly COUNTDOWN_SOUND:    string  = CCommon.BASE_URL  + CCommon.BASE_SERVER_PORT + "/audio/countdown_01.mp3";

  public counter:           string;
  public username:          string | null;
  public opponentName:      string;
  public opponentImage:     string;
  public userImage:         string;
  public isCounterStarted:  boolean;

  public constructor(
    private router:         Router,
    private httpClient:     HttpClient,
    private snackBar:       MatSnackBar,
    private socketService:  SocketService,
  ) {
    this.counter        = "";
    this.opponentName   = "";
    this.opponentImage  = "";
    this.username       = sessionStorage.getItem(CClient.USERNAME_KEY);
    this.userImage      = CClient.PATH_TO_PROFILE_IMAGES + this.username + ".bmp" + "?" + new Date().getTime();
    this.isCounterStarted = false;
    this.initCounterListener();
    this.initOpponentUsername();
  }

  private initCounterListener(): void {
    this.socketService.onMessage(CCommon.ON_COUNTDOWN).subscribe((message: number) => {

      this.counter = (message === 0) ? GO_MESSAGE : message.toString();
      if (message === COUNTDOWN_START ) {
        this.isCounterStarted = true;
        this.countdownSound.nativeElement.play();
      }
    });
  }

  private initOpponentUsername(): void {
    this.socketService.onMessage(CCommon.ON_COUNTDOWN_START).subscribe((message: string[]) => {
      const index: number = message[0] === this.username ? 1 : 0;
      this.opponentName = message[index];
      this.opponentImage = CClient.PATH_TO_PROFILE_IMAGES + this.opponentName + ".bmp";
    });
  }

  public cancelRequest(): void {
    this.httpClient.get(CClient.CANCEL_REQUEST_PATH + this.gameID + "/" + CardDeleted.false).subscribe((response: Message) => {
      const message: string = (response.title === CCommon.ON_SUCCESS) ? SUCCESS_MESSAGE : ERROR_MESSAGE;
      this.openSnackbar(message);
      this.router.navigate([CClient.GAMELIST_REDIRECT]).catch((error: TypeError) => this.openSnackbar(error.message));
    });
  }

  private openSnackbar(message: string): void {
    this.snackBar.open( message, CClient.SNACK_ACTION, {
      duration:           CClient.SNACKBAR_DURATION,
      verticalPosition:   "top",
      panelClass:         ["snackbar"],
    });
  }

}
