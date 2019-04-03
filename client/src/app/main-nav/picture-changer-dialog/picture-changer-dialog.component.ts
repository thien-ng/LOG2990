import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { CClient } from "src/app/CClient";
import { Message } from "../../../../../common/communication/message";
import { CCommon } from "../../../../../common/constantes/cCommon";

const DELAY_CLICK: number = 1000;

@Component({
  selector: "app-picture-changer-dialog",
  templateUrl: "./picture-changer-dialog.component.html",
  styleUrls: ["./picture-changer-dialog.component.css"],
})

export class PictureChangerDialogComponent {
  public profilePic: string;
  public username:   string | null;
  public isDisable:  boolean;

  public constructor(
    private httpClient: HttpClient,
    public dialogRef: MatDialogRef<PictureChangerDialogComponent>,
    ) {
      this.username   = sessionStorage.getItem(CClient.USERNAME_KEY);
      this.profilePic = CClient.PATH_TO_PROFILE_IMAGES + this.username + ".bmp" + "?" + new Date().getTime();
      this.isDisable  = false;
     }

  public changeImage(): void {
    if (this.username === null) {
      return;
    }
    const message: Message = {
      title: "username",
      body: this.username,
    };
    this.httpClient.post<Message>(CClient.PATH_TO_NEW_PICTURE, message).subscribe((message: Message) => {
      if (message.title !== CCommon.ON_ERROR) {
        window.setTimeout(() => {
          this.profilePic = CClient.PATH_TO_PROFILE_IMAGES + this.username + ".bmp" + "?" + new Date().getTime();
        },                DELAY_CLICK);
      }
      });
    this.isDisable = true;
    window.setTimeout(() => {this.isDisable = false; }, DELAY_CLICK);
    }

  public updateImage(): void {
    this.dialogRef.close(this.profilePic);
  }

}
