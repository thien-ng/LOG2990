import { Component, Inject, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { CClient } from "./CClient";
import { SocketService } from "./websocket/socket.service";

@Component({
  selector:     "app-root",
  templateUrl:  "./app.component.html",
  styleUrls:    ["./app.component.css"],
})
export class AppComponent implements OnInit {

  public constructor(
    @Inject(SocketService) private socketService: SocketService,
    private router:   Router,
    private snackBar: MatSnackBar) {
    this.socketService.initWebsocketListener();
  }

  public ngOnInit(): void {
    this.router.navigate([CClient.LOGIN_PATH]).catch((error) => this.openSnackbar(error));
  }

  private openSnackbar(response: string): void {
    this.snackBar.open( response, CClient.SNACK_ACTION, {
      duration:           CClient.SNACKBAR_DURATION,
      verticalPosition:   "top",
      panelClass:         ["snackbar"],
    });
  }
}
