import { Component, Inject} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "app-confirmation-dialog",
  templateUrl: "./confirmation-dialog.component.html",
  styleUrls: ["./confirmation-dialog.component.css"],
})
export class ConfirmationDialogComponent {

  public TITLE:           string = "Avertissement";
  public cardTitle:       string;
  public MESSAGE:         string;
  public YES_BUTTON_TEXT: string = "Oui";
  public NO_BUTTON_TEXT:  string = "Non";

  public constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {
      this.cardTitle = data;
      this.MESSAGE = "Voulez vous vraiment supprimer le jeu";
  }

  public decline(): void {
    this.dialogRef.close(false);
  }

  public accept(): void {
    this.dialogRef.close(true);
  }

}
