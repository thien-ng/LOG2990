import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatDialogRef, MatSnackBar } from "@angular/material";
import { Constants } from "../constants";
import { FileValidatorService } from "./game-validator.service";

@Component({
  selector: "app-create-simple-game",
  templateUrl: "./create-simple-game.component.html",
  styleUrls: ["./create-simple-game.component.css"],
})
export class CreateSimpleGameComponent implements OnInit {

  public TITLE: string = "Créer un jeu de point de vue simple";
  public ORIGINAL_IMAGE: string = "Image originale";
  public MODIFIED_IMAGE: string = "Image modifiée";
  public SUBMIT: string = "Soumettre";
  public CANCEL: string = "Annuler";
  public MAX_LENGTH: number = 15;
  public IS_IMAGE_BMP: boolean[] = [false, false];
  public ORIGINAL_INDEX: number = 0;
  public MODIFIED_INDEX: number = 1;
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
              this.IS_IMAGE_BMP[this.ORIGINAL_INDEX] && this.IS_IMAGE_BMP[this.MODIFIED_INDEX]);
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
      this.IS_IMAGE_BMP[imageIndex] = true;
    } else {
      this.IS_IMAGE_BMP[imageIndex] = false;
      this.snackBar.open(Constants.SNACK_ERROR_MSG, Constants.SNACK_ACTION, {
        duration: Constants.SNACKBAR_DURATION,
        verticalPosition: "top",
      });
    }
  }

  public submit(data: NgForm): void {
    this.dialogRef.close(JSON.stringify(data.value));
  }
}
