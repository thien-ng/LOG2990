import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";

import { CreateSimpleGameComponent } from "../create-simple-game/create-simple-game.component";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.css"],
  entryComponents: [CreateSimpleGameComponent],
})
export class AdminComponent implements OnInit {
  public constructor(public dialog: MatDialog) {
    /* default constructor */
  }

  public ngOnInit(): void {
    /* default ngOnInit */
  }

  public openDialog(): void {

    const dialogConfig: MatDialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef: MatDialogRef<CreateSimpleGameComponent> = this.dialog.open(CreateSimpleGameComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      // à faire - envoyer les données au serveur
      console.log(`Dialog result: ${result}`);
    });
  }

}
