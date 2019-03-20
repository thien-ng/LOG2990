import { HttpClient } from "@angular/common/http";
import { Component, Input } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { CardDeleted } from "../../../../common/communication/iCard";
import { Message } from "../../../../common/communication/message";
import { CCommon } from "../../../../common/constantes/cCommon";
import { Constants } from "../constants";
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

  public counter: string;

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
    this.initCounterListener();
  }


  public cancelRequest(): void {
    this.httpClient.get(Constants.CANCEL_REQUEST_PATH + this.gameID + "/" + CardDeleted.false).subscribe((response: Message) => {
      const message: string = (response.title === CCommon.ON_SUCCESS) ? SUCCESS_MESSAGE : ERROR_MESSAGE;
      this.openSnackbar(message);
      this.router.navigate([Constants.GAMELIST_REDIRECT]).catch((error: TypeError) => this.openSnackbar(error.message));
    });
  }

  private openSnackbar(message: string): void {
    this.snackBar.open( message, Constants.SNACK_ACTION, {
      duration:           Constants.SNACKBAR_DURATION,
      verticalPosition:   "top",
      panelClass:         ["snackbar"],
    });
  }

}
