import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { Router } from "@angular/router";
import { mock } from "ts-mockito";
import { AdminToggleService } from "./admin-toggle.service";

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
    router = mock(Router);
    adminToggleService = new AdminToggleService(router);
  });

  it("should be created", () => {
    const service: AdminToggleService = TestBed.get(AdminToggleService);
    expect(service).toBeTruthy();
  });
  it("should return true", () => {
    adminToggleService.adminTrue();
    expect(adminToggleService.isAdmin).toBe(true);
  });
  it("should return true", () => {
    adminToggleService.adminTrue();
    adminToggleService.getAdminUpdateListener()
      .subscribe((activeState: boolean) => {
        expect(activeState).toBe(true);
      });
  });
});
