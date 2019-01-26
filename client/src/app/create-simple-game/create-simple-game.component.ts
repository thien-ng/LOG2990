import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatDialogRef, MatSnackBar } from "@angular/material";
import { Constants } from "../constants";
import { FileValidatorService } from "./game-validator.service";

const SNACK_DURATION: number = 3000;
const ERROR_MSG: string = "Veuillez entrer un fichier BMP";
const ACTION: string = "OK";

@Component({
  selector: "app-create-simple-game",
  templateUrl: "./create-simple-game.component.html",
  styleUrls: ["./create-simple-game.component.css"],
})
export class CreateSimpleGameComponent implements OnInit {

  public _title: string = "Créer un jeu de point de vue simple";
  public _originalImage: string = "Image originale";
  public _modifiedImage: string = "Image modifiée";
  public _submit: string = "Soumettre";
  public _cancel: string = "Annuler";
  public _maxlength: number = 15;
  public _isImageBMP: boolean[] = [false, false];
  public _originalIndex: number = 0;
  public _modifiedIndex: number = 1;
  public ERROR_PATTERN: string = "Caractères autorisés: A-Z, a-z";
  public ERROR_SIZE: string = "Taille: "
                                  + Constants.MIN_GAME_LENGTH + "-"
                                  + Constants.MAX_GAME_LENGTH + " caractères";
  public ERROR_REQUIRED: string = "Nom de jeu requis";

  private _selectedFiles: Blob[] = [];

  public constructor(
    public dialogRef: MatDialogRef<CreateSimpleGameComponent>,
    public fileValidatorService: FileValidatorService,
    private snackBar: MatSnackBar,
    ) {/* default constructor */}

  public ngOnInit(): void {
    // default init
  }

  public hasFormControlErrors(): boolean {
    return !( this.fileValidatorService._gameNameFormControl.errors == null &&
              this._isImageBMP[this._originalIndex] && this._isImageBMP[this._modifiedIndex]);
  }

  public hasErrorOfType(errorType: string): boolean {
    return this.fileValidatorService._gameNameFormControl.hasError(errorType);
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public onFileSelected(file: Blob, imageIndex: number): void {
    if (this.fileValidatorService.validateFile(file)) {
      this._selectedFiles.push(file);
      this._isImageBMP[imageIndex] = true;
    } else {
      this._isImageBMP[imageIndex] = false;
      this.snackBar.open(ERROR_MSG, ACTION, {
        duration: SNACK_DURATION,
        verticalPosition: "top",
      });
    }
  }

  public submit(data: NgForm): void {
    this.dialogRef.close(JSON.stringify(data.value));
  }
}
