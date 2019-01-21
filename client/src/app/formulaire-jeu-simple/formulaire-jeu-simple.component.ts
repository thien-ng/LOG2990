import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
  selector: "app-formulaire-jeu-simple",
  templateUrl: "./formulaire-jeu-simple.component.html",
  styleUrls: ["./formulaire-jeu-simple.component.css"],
})
export class FormulaireJeuSimpleComponent implements OnInit {

  public constructor(
    public dialogRef: MatDialogRef<FormulaireJeuSimpleComponent>) {
    // default constructor
  }

  public ngOnInit(): void {
    // default init
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public submit(): void {
    // TBD
  }
}
