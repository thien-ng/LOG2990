import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Rgba } from "ngx-color-picker";
import { CClient } from "src/app/CClient";
import { IProfileRequest } from "../../../../common/communication/iUser";
import { Message } from "../../../../common/communication/message";
import { CCommon } from "../../../../common/constantes/cCommon";

enum GenerationType {
  random,
  chosen,
}

const RGB_REGEX: RegExp = /[^\d,]/g;
const R:         number = 0;
const G:         number = 1;
const B:         number = 2;

@Component({
  selector: "app-picture-changer-dialog",
  templateUrl: "./picture-changer-dialog.component.html",
  styleUrls: ["./picture-changer-dialog.component.css"],
})
export class PictureChangerDialogComponent {

  public readonly TITRE:       string = "Générateur d'avatar";
  public readonly COLOR:       string = "rgba(232, 17, 135, 1)";
  public readonly OPTION1:     string = "Couleur aléatoire";
  public readonly OPTION2:     string = "Choisir couleur";
  public readonly CHOOSE_TEXT: string = "Choisir";

  public profilePic:     string;
  public username:       string | null;
  public isDisable:      boolean;
  public colorChosen:    Rgba;
  public generationType: number;

  public constructor(
    private httpClient: HttpClient,
    public dialogRef: MatDialogRef<PictureChangerDialogComponent>,
    ) {
      this.colorChosen    = new Rgba(0, 0, 0, 1);
      this.generationType = 0;
      this.username       = sessionStorage.getItem(CClient.USERNAME_KEY);
      this.profilePic     = CClient.PATH_TO_PROFILE_IMAGES + this.username + ".bmp" + "?" + new Date().getTime();
      this.isDisable      = false;
      this.dialogRef.backdropClick().subscribe(() => {
        this.updateImage();
      });
  }

  public changeImage(): void {
    if (this.username === null) {
      return;
    }

    const colorIsChosen: boolean   =  Number(this.generationType) === Number(GenerationType.chosen);
    const message: IProfileRequest = {
      username: this.username,
    };

    if (colorIsChosen) {
      message.color = {
        R: this.colorChosen.r,
        G: this.colorChosen.g,
        B: this.colorChosen.b,
      };
    }

    this.isDisable = true;
    this.httpClient.post<Message>(CClient.PATH_TO_PROFILE_PICTURE, message).subscribe((response: Message) => {
      if (response.title !== CCommon.ON_ERROR) {
        this.profilePic = CClient.PATH_TO_PROFILE_IMAGES + this.username + ".bmp" + "?" + new Date().getTime();
        this.isDisable = false;
      }
    });
  }

  public setChosenColor(color: string): void {
    const rgb: number[] = this.getRGBFromString(color);
    this.colorChosen.r = rgb[R];
    this.colorChosen.g = rgb[G];
    this.colorChosen.b = rgb[B];
  }

  private getRGBFromString(str: string): number[] {
    const rgbString: string[] = str.replace(RGB_REGEX, "").split(",");
    const rgb:       number[] = [];
    rgbString.forEach((color: string) => {
      rgb.push(Number(color));
    });

    return rgb;
  }

  public updateImage(): void {
    this.dialogRef.close(this.profilePic);
  }
}
