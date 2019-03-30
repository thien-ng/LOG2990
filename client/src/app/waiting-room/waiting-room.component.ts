import { HttpClient } from "@angular/common/http";
import { Component, Input } from "@angular/core";
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

@Component({
  selector: "app-waiting-room",
  templateUrl: "./waiting-room.component.html",
  styleUrls: ["./waiting-room.component.css"],
})
export class WaitingRoomComponent {

  public readonly CANCEL_BUTTON_TEXT: string = "Retourner à la liste de jeu";
  public readonly LOBBY_MESSAGE:      string = "En attente d'un autre joueur...";
  public readonly imgPlaceHolder:     string;
  public readonly VSIMAGE:            string = CClient.PATH_TO_IMAGES + "/versus.png";

  public counter:   string;
  public username:  string | null;

  @Input()
  public isMultiplayer: boolean;

  @Input()
  private gameID: string | null;

  public constructor(
    private router:         Router,
    private httpClient:     HttpClient,
    private snackBar:       MatSnackBar,
    private socketService:  SocketService,
  ) {
    this.counter = "";
    this.username = sessionStorage.getItem(CClient.USERNAME_KEY);
    this.imgPlaceHolder = CClient.PATH_TO_PROFILE_IMAGES + this.username + ".bmp";
    this.initCounterListener();
  }

  private initCounterListener(): void {
    this.socketService.onMessage(CCommon.ON_COUNTDOWN).subscribe((message: number) => {

      this.counter = (message === 0) ? GO_MESSAGE : message.toString();
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
