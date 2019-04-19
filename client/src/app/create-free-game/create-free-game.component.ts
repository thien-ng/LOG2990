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
import { IMesh, ISceneObject } from "../../../../common/communication/iSceneObject";
import { ISceneData } from "../../../../common/communication/iSceneVariables";
import { FormMessage } from "../../../../common/communication/message";
import { CCommon } from "../../../../common/constantes/cCommon";
import { CClient } from "../CClient";

@Component({
  selector:     "app-create-free-game",
  templateUrl:  "./create-free-game.component.html",
  styleUrls:    ["./create-free-game.component.css"],
})
export class CreateFreeGameComponent {

  public readonly INVALID_NAME:         string = "Nom de jeu requis: Taille entre "
                                                  + CCommon.MIN_GAME_LENGTH
                                                  + " et "
                                                  + CCommon.MAX_GAME_LENGTH
                                                  + " caractères" ;
  public readonly SUBMIT:               string  = "Soumettre";
  public readonly CANCEL:               string  = "Annuler";
  public readonly TITLE:                string  = "Créer un jeu de point de vue libre";
  public readonly PLACE_HOLDER_NAME:    string  = "Nom du jeu";
  public readonly PLACE_HOLDER_TYPE:    string  = "Type d'objet";
  public readonly GEOMETRIC_OPTION:     string  = "Formes géométriques";
  public readonly THEMATIC_OPTION:      string  = "Thématique";
  public readonly EDIT_TYPE_ADD:        string  = "Ajout";
  public readonly EDIT_TYPE_DELETE:     string  = "Suppression";
  public readonly EDIT_TYPE_COLOR:      string  = "Changement de couleur";
  public readonly ATLEASTONE_CHECKED:   string  = "Au moins une option doit être cochée";
  public readonly NEEDED_SNAPSHOT:      boolean = true;
  public readonly MIN_OBJECT_COUNT:     number  = 10;
  public readonly MAX_OBJECT_COUNT:     number  = 200;

  public readonly modifTypes: {name: string}[] = [
    { name:   this.EDIT_TYPE_ADD    },
    { name:   this.EDIT_TYPE_DELETE },
    { name:   this.EDIT_TYPE_COLOR  },
  ];

  public isButtonEnabled:               boolean;
  public addChecked:                    boolean;
  public delChecked:                    boolean;
  public colorChecked:                  boolean;
  public isLoading:                     boolean;
  public isSceneGenerated:              boolean;

  public sliderValue:                   number;
  public formControl:                   FormGroup;
  public sceneData:                     ISceneData<ISceneObject | IMesh>;

  public constructor(
    public  dialogRef:    MatDialogRef<CreateFreeGameComponent>,
    private formBuilder:  FormBuilder,
    private httpClient:   HttpClient,
    private snackBar:     MatSnackBar,
  ) {

    this.sliderValue      = CClient.DEFAULT_SLIDER_VALUE;
    this.isButtonEnabled  = true;
    this.addChecked       = false;
    this.delChecked       = false;
    this.colorChecked     = false;

    const controls: FormControl[] = this.modifTypes.map(() => new FormControl(false));
    this.formControl = this.formBuilder.group({
      nameControl: new FormControl("", [
        Validators.required,
        Validators.pattern(CCommon.REGEX_PATTERN_ALPHANUM),
        Validators.minLength(CCommon.MIN_GAME_LENGTH),
        Validators.maxLength(CCommon.MAX_GAME_LENGTH),
      ]),
      selectControl: new FormControl("", [
        Validators.required,
      ]),
      modifTypes: new FormArray(controls, this.atLeastOneIsChecked(1)),
    });
    this.isSceneGenerated = false;
  }

  public hasNameControlErrors(): boolean {
    return this.formControl.controls.nameControl.errors === null || this.formControl.controls.nameControl.pristine;
  }

  public hasCheckboxControlErrors(): boolean {
    return this.formControl.controls.modifTypes.valid || this.formControl.controls.modifTypes.pristine;
  }

  public clampSliderValues(value: number): void {
    if (value < this.MIN_OBJECT_COUNT) {
      this.sliderValue = this.MIN_OBJECT_COUNT;
    } else if (value > this.MAX_OBJECT_COUNT) {
      this.sliderValue = this.MAX_OBJECT_COUNT;
    }
  }

  public hasFormControlErrors(): boolean {
    const hasErrorForm:     Boolean = this.formControl.controls.nameControl.errors == null;
    const checkboxChecked:  Boolean = this.formControl.controls.modifTypes.valid;
    const selectedOne:      Boolean = this.formControl.controls.selectControl.valid;

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
      gameName:         this.capitalizeFirstLetter(formData.value.nameControl),
      checkedTypes:     formData.value.modifTypes,
      theme:            formData.value.selectControl,
      quantityChange:   this.sliderValue,
    } as FormMessage;
  }

  private capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

  public submit(formData: NgForm): void {
    this.isLoading = false;
    this.isButtonEnabled = false;
    const formValue: FormMessage = this.createFormMessage(formData);

    this.httpClient.post(CClient.FREE_SCENE_GENERATOR_PATH, formValue).subscribe(
      (response: ISceneData<ISceneObject | IMesh> | string) => {
        if (typeof response === "string") {
          this.isLoading = false;
          this.openSnackBar(response, CClient.SNACK_ACTION);
        } else {
          this.sceneData = response;
          this.isSceneGenerated = true;
        }
    });
    this.isButtonEnabled = true;
    this.isLoading = true;
  }

  private openSnackBar(msg: string, action: string): void {
    this.snackBar.open(msg, action, {
      duration: CClient.SNACKBAR_DURATION,
      verticalPosition: "top",
    });
  }
}
