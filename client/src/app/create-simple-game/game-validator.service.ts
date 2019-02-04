import { Injectable } from "@angular/core";

const ACCEPTED_FILE_TYPE: string = "image/bmp";

@Injectable({
  providedIn: "root",
})
export class FileValidatorService {

  public validateFile(file: Blob): boolean {

    return file !== undefined ? file.type === ACCEPTED_FILE_TYPE : false;
  }
}
