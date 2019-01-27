import { Injectable } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { Constants } from "../constants";
import { MyErrorStateMatcher } from "../login/login-validator.service";

const ACCEPTED_FILE_TYPE: string = "image/bmp";

@Injectable({
  providedIn: "root",
})
export class FileValidatorService {

  public _matcher: MyErrorStateMatcher = new MyErrorStateMatcher();

  public _gameNameFormControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(Constants.GAME_REGEX_PATTERN),
    Validators.minLength(Constants.MIN_GAME_LENGTH),
    Validators.maxLength(Constants.MAX_GAME_LENGTH),
  ]);

  public validateFile(file: Blob): boolean {
    return file.type === ACCEPTED_FILE_TYPE;
  }

}
