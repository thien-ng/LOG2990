import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
  ValidatorFn
} from "@angular/forms";
import { MatDialogRef, MatSnackBar } from "@angular/material";
import { FormMessage, Message } from "../../../../common/communication/message";
import { CardManagerService } from "../card/card-manager.service";
import { Constants } from "../constants";

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
  public readonly ATLEASTONE_CHECKED: string = "Au moins une option doit être cochée";

  public formControl: FormGroup;

  public modifTypes: {name: string}[] = [
      { name: this.EDIT_TYPE_ADD },
      { name: this.EDIT_TYPE_DELETE},
      { name: this.EDIT_TYPE_COLOR},
    ];

  public constructor(
    private dialogRef: MatDialogRef<CreateFreeGameComponent>,
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private snackBar: MatSnackBar,
    private cardManagerService: CardManagerService,
  ) {

    const controls: FormControl[] = this.modifTypes.map(() => new FormControl(false));
    this.formControl = this.formBuilder.group({
      nameControl: new FormControl("", [
        Validators.required,
        Validators.pattern(Constants.GAME_REGEX_PATTERN),
        Validators.minLength(Constants.MIN_GAME_LENGTH),
        Validators.maxLength(Constants.MAX_GAME_LENGTH),
      ]),
      selectControl: new FormControl("", [
        Validators.required,
      ]),
      modifTypes: new FormArray(controls, this.atLeastOneIsChecked(1)),
    });
  }

  public hasNameControlErrors(): boolean {
    return this.formControl.controls.nameControl.errors === null || this.formControl.controls.nameControl.pristine;
  }

  public hasCheckboxControlErrors(): boolean {
    return this.formControl.controls.modifTypes.valid || this.formControl.controls.modifTypes.pristine;
  }

  public verify(e: number): void {
    if (e < this.MIN_VALUE) {
      this.sliderValue = this.MIN_VALUE;
    } else if (e > this.MAX_VALUE) {
      this.sliderValue = this.MAX_VALUE;
    }
  }

  public hasFormControlErrors(): boolean {
    const hasErrorForm: Boolean = this.formControl.controls.nameControl.errors == null;
    const checkboxChecked: Boolean = this.formControl.controls.modifTypes.valid;
    const selectedOne: Boolean = this.formControl.controls.selectControl.valid;

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

  private createFormMessage(formData: NgForm): FormMessage {
    return {
      gameName: formData.value.nameControl,
      checkedTypes: formData.value.modifTypes,
      selectedOption: formData.value.selectControl,
      quantityChange: this.sliderValue,
    } as FormMessage;
  }

  public submit(formData: NgForm): void {
    this.isButtonEnabled = false;
    const formValue: FormMessage = this.createFormMessage(formData);

    this.httpClient.post(Constants.FREE_SUBMIT_PATH, formValue).subscribe((response: Message) => {
      this.analyseResponse(response);
      this.isButtonEnabled = true;
    });
  }

  private analyseResponse(response: Message): void {
    if (response.title === Constants.ON_SUCCESS_MESSAGE) {
      this.cardManagerService.updateCards(true);
      this.dialogRef.close();
    } else if (response.title === Constants.ON_ERROR_MESSAGE) {
      this.openSnackBar(response.body, Constants.SNACK_ACTION);
    }
  }

  private openSnackBar(msg: string, action: string): void {
    this.snackBar.open(msg, action, {
      duration: Constants.SNACKBAR_DURATION,
      verticalPosition: "top",
    });
  }
}
