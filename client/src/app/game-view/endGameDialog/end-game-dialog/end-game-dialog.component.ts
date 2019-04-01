import { Component, Inject} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

const WIN_TEXT:         string = "Vous avez gagné!";
const LOSS_TEXT:        string = "Vous avez perdu!";
const WIN_PROPOSITION:  string = "Retourner à la liste de jeux";
const LOSS_PROPOSITION: string = "Voulez-vous rejouer?";

@Component({
  selector:     "app-end-game-dialog",
  templateUrl:  "./end-game-dialog.component.html",
  styleUrls:    ["./end-game-dialog.component.scss"],
})
export class EndGameDialogComponent {

  public readonly WIN_BUTTON_TEXT: string = "LISTE DE JEUX";
  public readonly YES_BUTTON_TEXT: string = "OUI";
  public readonly NO_BUTTON_TEXT:  string = "NON";
  public readonly winStatus:       string;
  public readonly proposition:     string;

  public constructor(
    public dialogRef: MatDialogRef<EndGameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public isWinner: boolean) {
      this.winStatus   = (isWinner) ? WIN_TEXT : LOSS_TEXT;
      this.proposition = (isWinner) ? WIN_PROPOSITION : LOSS_PROPOSITION;
  }

  public returnToList(): void {
    this.dialogRef.close(false);
  }

  public startNewGame(): void {
    this.dialogRef.close(true);
  }

}
