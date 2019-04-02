import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { CClient } from "src/app/CClient";

@Component({
  selector: "app-picture-changer-dialog",
  templateUrl: "./picture-changer-dialog.component.html",
  styleUrls: ["./picture-changer-dialog.component.css"],
})
export class PictureChangerDialogComponent {
  public profilePic: string;
  public username:   string | null;
  public isDisable:    boolean;

  public constructor(
    private httpClient: HttpClient,
    public dialogRef: MatDialogRef<PictureChangerDialogComponent>,
    ) {
    this.username   = sessionStorage.getItem(CClient.USERNAME_KEY);
    this.profilePic = CClient.PATH_TO_PROFILE_IMAGES + this.username + ".bmp" + "?" + new Date().getTime();
    this.isDisable  = false;
   }

  public changeImage(): void {
    this.httpClient.get(CClient.PATH_TO_NEW_PICTURE + "/" + this.username).subscribe(() => {
      window.setTimeout(() => {
        this.profilePic = CClient.PATH_TO_PROFILE_IMAGES + this.username + ".bmp" + "?" + new Date().getTime();
      }, 1000);
    });
    this.isDisable = true;
    window.setTimeout(() => {this.isDisable = false; }, 1500);
  }

  public updateImage(): void {
    this.dialogRef.close(this.profilePic);
  }

}
