import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { FormControl, FormGroup, NgForm, Validators } from "@angular/forms";
import { MatDialogRef, MatSnackBar } from "@angular/material";
import { Message } from "../../../../common/communication/message";
import { CCommon } from "../../../../common/constantes/cCommon";
import { CClient } from "../CClient";
import { CardManagerService } from "../card/card-manager.service";
import { FileValidatorService } from "./game-validator.service";

@Component({
  selector:     "app-create-simple-game",
  templateUrl:  "./create-simple-game.component.html",
  styleUrls:    ["./create-simple-game.component.css"],
})
export class CreateSimpleGameComponent {

  @ViewChild("checkOrigImage",   {read: ElementRef})  public checkOrigImage:     ElementRef;
  @ViewChild("checkModifImage",  {read: ElementRef})  public checkModifImage:    ElementRef;
  @ViewChild("buttonOriginal",   {read: ElementRef})  public buttonOriginal:     ElementRef<HTMLButtonElement>;
  @ViewChild("buttonModified",   {read: ElementRef})  public buttonModified:     ElementRef<HTMLButtonElement>;
  @ViewChild("originalInput",    {read: ElementRef})  public originalInput:      ElementRef<HTMLInputElement>;
  @ViewChild("modifiedInput",    {read: ElementRef})  public modifiedInput:      ElementRef<HTMLInputElement>;

  public readonly TITLE:          string    = "Créer un jeu de point de vue simple";
  public readonly PLACE_HOLDER:   string    = "Nom du jeu";
  public readonly ORIGINAL_IMAGE: string    = "Image originale";
  public readonly MODIFIED_IMAGE: string    = "Image modifiée";
  public readonly SUBMIT:         string    = "Soumettre";
  public readonly CANCEL:         string    = "Annuler";
  public readonly UPLOAD:         string    = "Choisir une image";
  public readonly MAX_LENGTH:     number    = 15;
  public readonly IS_IMAGE_BMP:   boolean[] = [false, false];
  public readonly ORIGINAL_INDEX: number    = 0;
  public readonly MODIFIED_INDEX: number    = 1;
  public readonly ERROR_PATTERN:  string    = "Caractères autorisés: A-Z, a-z";
  public readonly ERROR_SIZE:     string    = "Taille: " + CCommon.MIN_GAME_LENGTH + "-" + CCommon.MAX_GAME_LENGTH + " caractères";
  public readonly ERROR_REQUIRED: string    = "Nom de jeu requis";
  public readonly INVALID_NAME:   string    = this.ERROR_REQUIRED + ": " + this.ERROR_PATTERN + ", " + this.ERROR_SIZE;
  public readonly CHECK_CIRCLE:   string    = "cancel";

  private selectedFiles:          [Blob, Blob];

  public formControl:             FormGroup;
  public isGenerating:            boolean;
  public isButtonEnabled:         boolean;
  public isOriginalVisible:       Boolean;
  public isModifiedVisible:       Boolean;
  public nameOrigPlaceHolder:     string;
  public nameModifPlaceHolder:    string;

  public constructor(
    private dialogRef:            MatDialogRef<CreateSimpleGameComponent>,
    private fileValidatorService: FileValidatorService,
    private snackBar:             MatSnackBar,
    private httpClient:           HttpClient,
    private cardManagerService:   CardManagerService,
    ) {
      this.isButtonEnabled      = true;
      this.isOriginalVisible    = true;
      this.isModifiedVisible    = true;
      this.nameModifPlaceHolder = "";
      this.nameOrigPlaceHolder  = "";
      this.selectedFiles        = [new Blob(), new Blob()];
      this.isGenerating         = false;
      this.formControl          = new FormGroup({
        gameName: new FormControl("", [
          Validators.required,
          Validators.pattern(CCommon.REGEX_PATTERN_ALPHANUM),
          Validators.minLength(CCommon.MIN_GAME_LENGTH),
          Validators.maxLength(CCommon.MAX_GAME_LENGTH),
        ]),
      });
    }

  public hasNameControlErrors(): boolean {
    return this.formControl.controls.gameName.errors == null || this.formControl.controls.gameName.pristine;
  }

  public hasFormControlErrors(): boolean {
    const hasErrorForm: Boolean = this.formControl.controls.gameName.errors == null;
    const isImageBmp:   Boolean = this.IS_IMAGE_BMP[this.ORIGINAL_INDEX] && this.IS_IMAGE_BMP[this.MODIFIED_INDEX];

    return !(hasErrorForm && isImageBmp && this.isButtonEnabled);
  }

  public hasErrorOfType(errorType: string): boolean {
    return this.formControl.hasError(errorType);
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public onFileSelected(file: Blob, imageIndex: number, name: string): void {
    if (this.fileValidatorService.validateFile(file)) {
      this.selectedFiles[imageIndex]  = file;
      this.IS_IMAGE_BMP[imageIndex]   = true;
    } else {
      this.IS_IMAGE_BMP[imageIndex]   = false;
      if (name !== "") {
        this.openSnackBar(CClient.SNACK_ERROR_MSG, CClient.SNACK_ACTION);
      }
    }
    imageIndex === this.ORIGINAL_INDEX ? this.changeOriginalInput(name) : this.changeModifiedInput(name);
  }

  private changeModifiedInput(name: string): void {
    if (!this.IS_IMAGE_BMP[this.MODIFIED_INDEX]) {
      this.modifiedInput.nativeElement.value          = "";
      this.checkModifImage.nativeElement.textContent  = null;
      this.nameModifPlaceHolder                       = "";
      this.isModifiedVisible                          = true;
    } else {
      this.checkModifImage.nativeElement.textContent  = this.CHECK_CIRCLE;
      this.nameModifPlaceHolder                       = name;
      this.isModifiedVisible                          = false;
    }
  }

  private changeOriginalInput(name: string): void {
    if (!this.IS_IMAGE_BMP[this.ORIGINAL_INDEX]) {
      this.originalInput.nativeElement.value        = "";
      this.checkOrigImage.nativeElement.textContent = null;
      this.nameOrigPlaceHolder                      = "";
      this.isOriginalVisible                        = true;
    } else {
      this.checkOrigImage.nativeElement.textContent = this.CHECK_CIRCLE;
      this.nameOrigPlaceHolder                      = name;
      this.isOriginalVisible                        = false;
    }
  }

  private capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

  private createFormData(data: NgForm): FormData {
    const formdata: FormData = new FormData();
    formdata.append(CClient.NAME_KEY,           this.capitalizeFirstLetter(data.value.gameName));
    formdata.append(CClient.ORIGINAL_IMAGE_KEY, this.selectedFiles[this.ORIGINAL_INDEX]);
    formdata.append(CClient.MODIFIED_IMAGE_KEY, this.selectedFiles[this.MODIFIED_INDEX]);

    return formdata;
  }

  public submit(data: NgForm): void {
    this.isButtonEnabled      = false;
    this.isGenerating         = true;
    const formdata: FormData  = this.createFormData(data);

    this.httpClient.post(CClient.SIMPLE_SUBMIT_PATH, formdata).subscribe((response: Message) => {
      this.analyseResponse(response);
      this.isButtonEnabled = true;
    });
  }

  private analyseResponse(response: Message): void {
    if (response.title === CCommon.ON_SUCCESS) {
      this.cardManagerService.updateCards(true);
      this.dialogRef.close();
    } else if (response.title === CCommon.ON_ERROR) {
      this.openSnackBar(response.body, CClient.SNACK_ACTION);
    }
    this.isGenerating = false;
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration:           CClient.SNACKBAR_DURATION,
      verticalPosition:   "top",
    });
  }
}
