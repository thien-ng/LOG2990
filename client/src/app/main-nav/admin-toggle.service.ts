import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Observable, Subject } from "rxjs";
import { Constants } from "../constants";

@Injectable({
  providedIn: "root",
})
export class AdminToggleService {

  public constructor(public router: Router) {
    // Default constructor
  }

  private isAdmin: boolean;
  private adminUpdated: Subject<boolean> = new Subject<boolean>();

  public get isAdminState(): boolean {
    return this.isAdmin;
  }

  public getAdminUpdateListener(): Observable<boolean> {
    return this.adminUpdated.asObservable();
  }

  public adminToggle(): void {
    this.isAdmin = !this.isAdmin;
    let pathToGo: string;
    this.isAdmin ? pathToGo = Constants.ADMIN_PATH : pathToGo = Constants.GAMELIST_PATH;
    this.router.navigate([pathToGo]).catch(() => Constants.OBLIGATORY_CATCH);
    this.adminUpdated.next(this.isAdmin);
  }

  public adminTrue(): void {
    this.isAdmin = true;
    this.adminUpdated.next(this.isAdmin);
  }

}
