import { Injectable } from "@angular/core";

const ACCEPTED_FILE_TYPE: string = "image/bmp";

@Injectable({
  providedIn: "root",
})
export class FileValidatorService {

  public validateFile(file: Blob): boolean {
    if (file !== undefined) {
      return file.type === ACCEPTED_FILE_TYPE;
    } else {
      return false;
    }
  }

}
