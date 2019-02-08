import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";
import { Constants } from "../constants";

@Component({
  selector: "app-create-free-game",
  templateUrl: "./create-free-game.component.html",
  styleUrls: ["./create-free-game.component.css"],
})
export class CreateFreeGameComponent {

  public readonly MAX_VALUE: number = 200;
  public readonly MIN_VALUE: number = 10;
  public sliderValue: number = 100;
  public addChecked: boolean = false;
  public delChecked: boolean = false;
  public colorChecked: boolean = false;
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
  public readonly EDIT_TYPE_ADD: string = "Ajout";
  public readonly EDIT_TYPE_DELETE: string = "Suppression";
  public readonly EDIT_TYPE_COLOR: string = "Changement de couleur";

  public nameControl: FormControl =  new FormControl("", [
      Validators.required,
      Validators.pattern(Constants.GAME_REGEX_PATTERN),
      Validators.minLength(Constants.MIN_GAME_LENGTH),
      Validators.maxLength(Constants.MAX_GAME_LENGTH),
    ]);
  public constructor(
    private dialogRef: MatDialogRef<CreateFreeGameComponent>,
  ) {
    // default constructor
  }

  public verify(e: number): void {
    if (e < this.MIN_VALUE) {
      this.sliderValue = this.MIN_VALUE;
    } else if (e > this.MAX_VALUE) {
      this.sliderValue = this.MAX_VALUE;
    }
  }

  public getChecked(): [boolean, boolean, boolean] {
    return [this.addChecked, this.delChecked, this.colorChecked];
  }

  public atLeastOneIsChecked(): boolean {
    let oneIsChecked: boolean = false;
    this.getChecked().forEach((element: boolean) => {
      if (element) {
        oneIsChecked = true;
      }
    });

    return oneIsChecked;
  }
  public closeDialog(): void {
    this.dialogRef.close();
  }
}
