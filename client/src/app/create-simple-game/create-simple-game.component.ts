import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "app-create-simple-game",
  templateUrl: "./create-simple-game.component.html",
  styleUrls: ["./create-simple-game.component.css"],
})
export class CreateSimpleGameComponent implements OnInit {

  public constructor(
    public dialogRef: MatDialogRef<CreateSimpleGameComponent>) {
    // default constructor
  }

  public ngOnInit(): void {
    // default init
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public submit(data: NgForm): void {
    this.dialogRef.close(JSON.stringify(data.value));
  }
}
