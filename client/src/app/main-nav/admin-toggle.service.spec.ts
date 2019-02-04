import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { Router } from "@angular/router";
import { Observable } from "rxjs";
import "rxjs/add/observable/of";
import { AdminToggleService } from "./admin-toggle.service";
import { Constants } from "../constants";

// tslint:disable:no-any no-floating-promises

let adminToggleService: AdminToggleService;
let router: Router;

describe("AdminToggleService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [AdminToggleService],
    imports: [
      RouterTestingModule,
    ],
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    router.initialNavigation();

    adminToggleService = new AdminToggleService(router);
  });

  it("should be created", () => {
    const service: AdminToggleService = TestBed.get(AdminToggleService);
    expect(service).toBeTruthy();
  });

  it("should return true when state is set to true", () => {
    adminToggleService.adminTrue();
    expect(adminToggleService.isAdminState).toBe(true);
  });

  it("should return true state is set to true after subscribe", () => {
    adminToggleService.getAdminUpdateListener()
    .subscribe((activeState: boolean) => {
      expect(activeState).toBe(true);
    });
    adminToggleService.adminTrue();
  });

  it("should toggle the value of isAdmin", () => {
    spyOn<any>(adminToggleService["router"], "navigate").and.returnValue(Observable.of("true")).and.callThrough();
    adminToggleService["isAdmin"] = true;
    adminToggleService.adminToggle();
    expect(adminToggleService["isAdmin"]).toBeFalsy();
  });

  it("should navigate to ADMIN_PATH", () => {
    spyOn<any>(adminToggleService["router"], "navigate").and.returnValue(Observable.of("true")).and.callThrough();

    adminToggleService["isAdmin"] = false;
    adminToggleService.adminToggle();
    expect(adminToggleService["router"].navigate).toHaveBeenCalledWith([Constants.ADMIN_PATH]);
  });

  it("should navigate to GAMELIST_PATH", () => {
    spyOn<any>(adminToggleService["router"], "navigate").and.returnValue(Observable.of("true")).and.callThrough();

    adminToggleService["isAdmin"] = true;
    adminToggleService.adminToggle();
    expect(adminToggleService["router"].navigate).toHaveBeenCalledWith([Constants.GAMELIST_PATH]);
  });

});
