import { TestBed } from "@angular/core/testing";
// Jai pas import tt les testing modules pcq jai juste besoin de celui la
import { RouterTestingModule } from "@angular/router/testing";

import { AdminToggleService } from "./admin-toggle.service";

describe("AdminToggleService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [AdminToggleService],
    imports: [
      RouterTestingModule,
    ],
  }));

  it("should be created", () => {
    const service: AdminToggleService = TestBed.get(AdminToggleService);
    expect(service).toBeTruthy();
  });
});
