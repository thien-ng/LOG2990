import { Component} from "@angular/core";
import { MatDialogRef } from "@angular/material";
// import { CardComponent } from "../card/card.component";

@Component({
  selector: "app-confirmation-dialog",
  templateUrl: "./confirmation-dialog.component.html",
  styleUrls: ["./confirmation-dialog.component.css"],
})
export class ConfirmationDialogComponent {

  public TITLE:           string = "Avertissement";
  public MESSAGE:         string = "Voulez vous vraiment supprimer ce jeu";
  public YES_BUTTON_TEXT: string = "Oui";
  public NO_BUTTON_TEXT:  string = "Non";
