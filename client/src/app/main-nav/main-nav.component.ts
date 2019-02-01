import { animate, state, style, transition, trigger } from "@angular/animations";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material";
import { Router } from "@angular/router";

import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { AdminToggleService } from "../admin-toggle.service";
import { Constants } from "../constants";
import { CreateSimpleGameComponent } from "../create-simple-game/create-simple-game.component";

@Component({
  selector: "app-main-nav",
  templateUrl: "./main-nav.component.html",
  styleUrls: ["./main-nav.component.css"],
  animations: [
    trigger("slideInOut", [
      state("open", style({})),
      state("closed", style({
        transform: "translateX(15em)",
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

  public isAdminMode: boolean;
  public LOGIN_PATH: string = Constants.LOGIN_REDIRECT;
  public CLIENT: string = "client";
  public TEXT_ADMIN: string = "Vue Administration";
  public TEXT_BOUTON_2D: string = "Créer jeu simple";
  public TEXT_BOUTON_3D: string = "Créer jeu 3D";
  private stateSubscription: Subscription;

  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((event) => event.matches));

  public openDialog(): void {

    const dialogConfig: MatDialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;

    this.dialog.open(CreateSimpleGameComponent, dialogConfig);
  }

  public ngOnInit(): void {
    this.isAdminMode = this.adminService.isAdminState;
    this.stateSubscription = this.adminService.getAdminUpdateListener()
      .subscribe((activeState: boolean) => {
        this.isAdminMode = activeState;
    });
  }

  public ngOnDestroy(): void {
    this.stateSubscription.unsubscribe();
  }

}
