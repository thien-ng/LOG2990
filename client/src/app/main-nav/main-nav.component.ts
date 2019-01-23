import { animate, state, style, transition, trigger } from "@angular/animations";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";

import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { AdminToggleService } from "../admin-toggle.service";
import { Constants } from "../constants";
import { CreateSimpleGameComponent } from "../create-simple-game/create-simple-game.component";
import { NavButton } from "./nav-button.interface";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.css"],
  animations: [
    trigger("slideInOut", [
      state("open", style({})),
      state("closed", style({
        transform: "translateX(60%)",
      })),
      transition("open => closed", [
        animate(Constants.ANIMATION_TIME),
      ]),
      transition("closed => open", [
        animate(Constants.ANIMATION_TIME),
      ]),
    ]),
  ],
})
export class MainNavComponent implements OnInit, OnDestroy {

  public constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    public adminService: AdminToggleService,
    public router: Router,
  ) {}

  public _isAdminMode: boolean;
  public _loginPath: string = Constants.LOGIN_REDIRECT;
  public _client: string = "client";
  private _stateSubscription: Subscription;

  public routes: NavButton[] = [
    { linkName: "Liste des jeux", url: "/gamelist" },
    { linkName: "Administration", url: "/admin" },
  ];

  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((event) => event.matches));

  public openDialog(): void {

    const dialogConfig: MatDialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    const dialogRef: MatDialogRef<CreateSimpleGameComponent> = this.dialog.open(CreateSimpleGameComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        alert(`(temporary) Dialog result: ${result}`);
      }
      // à faire - envoyer les données au serveur
      // console.log(`Dialog result: ${result}`);
    });
  }

  public ngOnInit(): void {
    this._isAdminMode = this.adminService.getAdminState();
    this._stateSubscription = this.adminService.getAdminUpdateListener()
      .subscribe((activeState: boolean) => {
        this._isAdminMode = activeState;
    });
  }

  public ngOnDestroy(): void {
    this._stateSubscription.unsubscribe();
  }

}
