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
