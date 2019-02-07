import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "app-create-free-game",
  templateUrl: "./create-free-game.component.html",
  styleUrls: ["./create-free-game.component.css"],
})
export class CreateFreeGameComponent {

  public readonly SUBMIT: string = "Soumettre";
  public readonly CANCEL: string = "Annuler";
  public readonly TITLE: string = "Créer un jeu de point de vue libre";
  public readonly PLACE_HOLDER_NAME: string = "Nom du jeu";
  public readonly PLACE_HOLDER_TYPE: string = "Type d'objet";
  public readonly SPHERE_OPTION: string = "Sphère";
  public readonly CUBE_OPTION: string = "Cube";
  public readonly CONE_OPTION: string = "Cône";
  public readonly CYLINDER_OPTION: string = "Cylindre";
  public readonly PYRAMID_OPTION: string = "Pyramide à base triangulaire";

  public constructor(
    private dialogRef: MatDialogRef<CreateFreeGameComponent>,
  ) {
    // default constructor
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
