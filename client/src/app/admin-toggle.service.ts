import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

import { Observable, Subject } from "rxjs";
import { Constants } from "./constants";

@Injectable({
  providedIn: "root",
})
export class AdminToggleService {

  public constructor( public router: Router ) {}

  private _isAdmin: boolean;
  private adminUpdated: Subject<boolean> = new Subject<boolean>();

  public getAdminState(): boolean {
    return this._isAdmin;
  }

  public getAdminUpdateListener(): Observable<boolean> {
    return this.adminUpdated.asObservable();
  }

  public adminToggle(): void {
    this._isAdmin = !this._isAdmin;
    if (this._isAdmin) {
      this.router.navigate([Constants.ADMIN_PATH]).catch(() => "obligatory catch");
    } else {
      this.router.navigate([Constants.GAMELIST_PATH]).catch(() => "obligatory catch");
    }
    this.adminUpdated.next(this._isAdmin);
  }
}
