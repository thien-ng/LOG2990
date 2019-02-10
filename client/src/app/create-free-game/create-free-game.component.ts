import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators, ValidatorFn } from "@angular/forms";
import { MatDialogRef } from "@angular/material";
import { FormMessage, Message } from "../../../../common/communication/message";
import { CardManagerService } from "../card/card-manager.service";
import { Constants } from "../constants";

const  SUBMIT_PATH: string = "/api/card/submitFree";

@Component({
  selector: "app-create-free-game",
  templateUrl: "./create-free-game.component.html",
  styleUrls: ["./create-free-game.component.css"],
})
export class CreateFreeGameComponent {

  public isButtonEnabled: boolean = true;
  public sliderValue: number = 100;
  public addChecked: boolean = false;
  public delChecked: boolean = false;
  public colorChecked: boolean = false;
  public readonly INVALID_NAME: string = "Nom invalide";
  public readonly MAX_VALUE: number = 200;
  public readonly MIN_VALUE: number = 10;
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

  public nameControl: FormControl = new FormControl("", [
      Validators.required,
      Validators.pattern(Constants.GAME_REGEX_PATTERN),
      Validators.minLength(Constants.MIN_GAME_LENGTH),
      Validators.maxLength(Constants.MAX_GAME_LENGTH),
    ]);
  public selectControl: FormControl = new FormControl("", [
    Validators.required,
  ]);

  public formCheckBox: FormGroup;

  public modifTypes: {name: string, id: number}[] = [
      { name: this.EDIT_TYPE_ADD, id: 1 },
      { name: this.EDIT_TYPE_DELETE, id: 2 },
      { name: this.EDIT_TYPE_COLOR, id: 3 },
    ];

  public constructor(
    private dialogRef: MatDialogRef<CreateFreeGameComponent>,
    private fb: FormBuilder,
    private http: HttpClient,
    private cardManagerService: CardManagerService,
  ) {

    const controls: FormControl[] = this.modifTypes.map(() => new FormControl(false));
    this.formCheckBox = this.fb.group({
      modifTypes: new FormArray(controls, this.atLeastOneIsChecked(1)),
    });
  }

  public verify(e: number): void {
    if (e < this.MIN_VALUE) {
      this.sliderValue = this.MIN_VALUE;
    } else if (e > this.MAX_VALUE) {
      this.sliderValue = this.MAX_VALUE;
    }
  }

  public hasFormControlErrors(): boolean {
    const hasErrorForm: Boolean = this.nameControl.errors == null;
    const checkboxChecked: Boolean = this.formCheckBox.valid;
    const selectedOne: Boolean = this.selectControl.valid;

    return !(hasErrorForm && checkboxChecked && selectedOne && this.isButtonEnabled);
  }

  public getChecked(): [boolean, boolean, boolean] {
    return [this.addChecked, this.delChecked, this.colorChecked];
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public atLeastOneIsChecked(min: number = 1): ValidatorFn {
    return (formArray: FormArray) => {
      const totalSelected: number = formArray.controls
        .map((control) => control.value)
        .reduce((prev, next) => next ? prev + next : prev, 0);

      return totalSelected >= min ? null : { required: true };
    };
  }

  public submit(nameForm: NgForm, checkboxForm: NgForm, selectedForm: NgForm): void {
    this.isButtonEnabled = false;
    const formValue: FormMessage = {
      gameName: nameForm.value,
      checkedTypes: checkboxForm.controls.modifTypes.value,
      selectedOption: selectedForm.value,
      quantityChange: this.sliderValue,
    };

    this.http.post(Constants.BASIC_SERVICE_BASE_URL + SUBMIT_PATH, formValue).subscribe((response: Message) => {
      if (response.title === Constants.ON_SUCCESS_MESSAGE) {
        this.cardManagerService.updateCards(true);
        this.isButtonEnabled = true;
      }
    });
    this.dialogRef.close();
  }
}
