import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Observable, Subject } from "rxjs";
import { Constants } from "../constants";

@Injectable({
  providedIn: "root",
})
export class AdminToggleService {

  private adminUpdated: Subject<boolean>;
  private isAdmin: boolean;

  public constructor(
    public router: Router,
    ) {
      this.adminUpdated = new Subject<boolean>();
    }

  public get isAdminState(): boolean {
    return this.isAdmin;
  }

  public getAdminUpdateListener(): Observable<boolean> {
    return this.adminUpdated.asObservable();
  }

  public adminToggle(): void {
    this.isAdmin = !this.isAdmin;
    const pathToGo: string = this.isAdmin ? Constants.ADMIN_PATH :  Constants.GAMELIST_PATH;
    this.router.navigate([pathToGo]).catch(() => Constants.OBLIGATORY_CATCH);
    this.adminUpdated.next(this.isAdmin);
  }

  public adminTrue(): void {
    this.isAdmin = true;
    this.adminUpdated.next(this.isAdmin);
  }

}
