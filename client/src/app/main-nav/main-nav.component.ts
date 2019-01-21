import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { Component } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";

import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CreateSimpleGameComponent } from "../create-simple-game/create-simple-game.component";

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
    private router: Router,
  ) {}

  public routeIncludes(r: string): boolean {
    return this.router.url.includes(r);
  }

  public openDialog(): void {

    const dialogConfig: MatDialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    const dialogRef: MatDialogRef<CreateSimpleGameComponent> = this.dialog.open(CreateSimpleGameComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      // à faire - envoyer les données au serveur
      // console.log(`Dialog result: ${result}`);
    });
  }
}
