import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CClient } from "src/app/CClient";
import { CardManagerService } from "src/app/card/card-manager.service";
import { GameMode, ICard } from "../../../../../common/communication/iCard";
import { INewGameInfo } from "../../../../../common/communication/iGameplay";
import { EndGameDialogComponent } from "./end-game-dialog/end-game-dialog.component";

const CARD_DELETED_MESSAGE: string = "La carte a été supprimée. Impossible de rejouer!";

@Injectable()
export class EndGameDialogService {

  public constructor(
    private dialogConfig: MatDialogConfig,
    private cardManager:  CardManagerService,
    private dialog:       MatDialog,
    private snackBar:     MatSnackBar,
    private router:       Router) {
    this.dialogConfig = new MatDialogConfig();
    this.dialogConfig.disableClose  = true;
    this.dialogConfig.autoFocus     = true;
    this.dialogConfig.hasBackdrop   = false;
    this.dialogConfig.autoFocus     = false;
    this.dialogConfig.panelClass    = "full-blend-dalog";
    this.dialogConfig.position      = {left: "27%"};
  }

  public openDialog(isWinner: boolean, newGameInfo: INewGameInfo, gamemode: GameMode): void {
    this.dialogConfig.data = isWinner;

    const dialogRef: MatDialogRef<EndGameDialogComponent> = this.dialog.open(EndGameDialogComponent, this.dialogConfig);
    dialogRef.beforeClosed().subscribe((result: boolean) => {
      this.cardManager.getCardById(newGameInfo.gameID, gamemode).subscribe((response: ICard) => {
        if (result && response.gameID === -1) {
          this.openSnackbar(CARD_DELETED_MESSAGE);
          this.router.navigate([CClient.GAMELIST_REDIRECT]).catch((error: Error) => this.openSnackbar(error.message));
        } else if (result) {
          this.router.navigate([CClient.GAMELIST_REDIRECT]).then(() => {
            this.router.navigate([newGameInfo.path, newGameInfo.gameID, newGameInfo.type])
            .catch((error) => this.openSnackbar(error.message));
          }).catch((error: Error) => this.openSnackbar(error.message));
        } else {
          this.router.navigate([CClient.GAMELIST_REDIRECT]).catch((error: Error) => this.openSnackbar(error.message));
        }
      });
    });
  }

  private openSnackbar(response: string): void {
    this.snackBar.open( response, CClient.SNACK_ACTION, {
      duration:           CClient.SNACKBAR_DURATION,
      verticalPosition:   "top",
      panelClass:         ["snackbar"],
    });
  }

}
