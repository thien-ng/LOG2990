import { Component, Inject} from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector:     "app-confirmation-dialog",
  templateUrl:  "./confirmation-dialog.component.html",
  styleUrls:    ["./confirmation-dialog.component.css"],
})
export class ConfirmationDialogComponent {

  public readonly YES_BUTTON_TEXT: string = "Oui";
  public readonly NO_BUTTON_TEXT:  string = "Non";
  public readonly WARNING_TITLE:   string = "Avertissement";
  public readonly CONFIRMATION:    string = "Voulez-vous vraiment supprimer le jeu";

  public cardTitle:       string;

  public constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string) {
      this.cardTitle = data;
  }

  public decline(): void {
    this.dialogRef.close(false);
  }

  public accept(): void {
    this.dialogRef.close(true);
  }

}
