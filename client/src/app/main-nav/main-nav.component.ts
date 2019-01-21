import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { Component } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { FormulaireJeuSimpleComponent } from "../formulaire-jeu-simple/formulaire-jeu-simple.component";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.css"],
})
export class MainNavComponent {
  // TBD : String magic in array ??

  public routes: Array<Object> = [
    { linkName: "Liste des jeux", url: "/nav/gamelist" },
    { linkName: "Administration", url: "/admin" },
  ];

  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((event) => event.matches));

  public constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public router: Router,
  ) {}

  public openDialog(): void {
    const dialogRef: MatDialogRef<FormulaireJeuSimpleComponent> = this.dialog.open(FormulaireJeuSimpleComponent);

    dialogRef.afterClosed().subscribe((result) => {
      // à faire - envoyer les données au serveur
      // console.log(`Dialog result: ${result}`);
    });
  }
}
