import { animate, state, style, transition, trigger } from "@angular/animations";
import { Breakpoints, BreakpointObserver } from "@angular/cdk/layout";
import { AfterViewChecked, ChangeDetectorRef , Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig, MatSnackBar } from "@angular/material";
import { NavigationEnd, Router } from "@angular/router";

import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { IUser } from "../../../../common/communication/iUser";
import { CCommon } from "../../../../common/constantes/cCommon";
import { CClient } from "../CClient";
import { CreateFreeGameComponent } from "../create-free-game/create-free-game.component";
import { CreateSimpleGameComponent } from "../create-simple-game/create-simple-game.component";
import { SocketService } from "../websocket/socket.service";
import { AdminToggleService } from "./admin-toggle.service";

@Component({
  selector:     "app-main-nav",
  templateUrl:  "./main-nav.component.html",
  styleUrls:    ["./main-nav.component.css"],
  animations:   [
    trigger("slideInOut", [
      state("open", style({})),
      state("closed", style({
        transform: "translateX(15em)",
      })),
      transition("open => closed", [
        animate(CClient.ANIMATION_TIME),
      ]),
      transition("closed => open", [
        animate(CClient.ANIMATION_TIME),
      ]),
    ]),
  ],
})
export class MainNavComponent implements OnInit, OnDestroy, AfterViewChecked {

  public  readonly LOGIN_PATH:      string = CClient.LOGIN_REDIRECT;
  public  readonly GAME_LIST_PATH:  string = "/gamelist";
  public  readonly ADMIN_PATH:      string = "/admin";
  public  readonly TEXT_ADMIN:      string = "Vue Administration";
  public  readonly TEXT_BOUTON_2D:  string = "Créer jeu simple";
  public  readonly TEXT_BOUTON_3D:  string = "Créer jeu 3D";
  private readonly MAX_VALUE_INIT:  number = 4;

  private stateSubscription:        Subscription;
  private compteurInit:             number;
  private isAdminPath:              boolean;
  private isGameListPath:           boolean;
  public  isAdminMode:              boolean;
  public  isValidUrl:               boolean;
  public  client:                   string | null;
  public  profileIcon:              string;

  public constructor(
    private breakpointObserver: BreakpointObserver,
    public  dialog:             MatDialog,
    private snackBar:           MatSnackBar,
    public  adminService:       AdminToggleService,
    public  router:             Router,
    private socketService:      SocketService,
    private changeDetector:     ChangeDetectorRef,
  ) {
    this.compteurInit = 0;
    this.client       = null;
    this.isValidUrl   = true;
    this.profileIcon  = "";

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isAdminPath    = this.router.url === this.ADMIN_PATH;
        this.isGameListPath = this.router.url === this.GAME_LIST_PATH;
        this.isValidUrl     = this.isAdminPath || this.isGameListPath;
      }
      this.changeDetector.detectChanges();
    });
  }

  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((event) => event.matches));

  public ngOnInit(): void {
    this.initMainNav();
  }

  public initMainNav(): void {
    this.client             = sessionStorage.getItem(CClient.USERNAME_KEY);
    this.isAdminMode        = this.adminService.isAdminState;
    this.stateSubscription  = this.adminService.getAdminUpdateListener()
      .subscribe((activeState: boolean) => {
        this.isAdminMode = activeState;
    });

    this.socketService.onMessage(CCommon.USER_EVENT).subscribe((answer: IUser) => {
      this.assignUser(answer);
    });
  }

  public ngAfterViewChecked(): void {
    this.neededRedirection();
  }

  private neededRedirection(): void {
    const isLoggedAfterInit:  boolean = this.compteurInit++ > this.MAX_VALUE_INIT;
    const isLogged:           boolean = this.client == null;
    const isNotAdminPath:     boolean = this.router.url !== this.ADMIN_PATH;
    if ( isLoggedAfterInit && isLogged && isNotAdminPath) {
      this.router.navigateByUrl(this.LOGIN_PATH).catch((error) => this.openSnackBar(error, CClient.SNACK_ACTION));
    }
  }

  private assignUser(user: IUser): void {
    sessionStorage.setItem(CClient.USERNAME_KEY, user.username);
    this.client       = user.username;
    this.profileIcon  = CClient.PATH_TO_PROFILE_IMAGES + this.client + ".bmp";
  }

  public openSimpleDialog(): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;

    this.dialog.open(CreateSimpleGameComponent, dialogConfig);
  }

  public openFreeDialog(): void {
    const dialogConfig: MatDialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus    = true;

    this.dialog.open(CreateFreeGameComponent, dialogConfig);
  }

  public redirectGameList(): void {
    this.router.navigate([CClient.GAMELIST_REDIRECT])
      .catch((error) => this.openSnackBar(error, CClient.SNACK_ACTION));
  }

  public ngOnDestroy(): void {
    if (this.stateSubscription !== undefined) {
      this.stateSubscription.unsubscribe();
    }
  }

  private openSnackBar(msg: string, action: string): void {
    this.snackBar.open(msg, action, {
      duration:           CClient.SNACKBAR_DURATION,
      verticalPosition:   "top",
    });
  }
}
