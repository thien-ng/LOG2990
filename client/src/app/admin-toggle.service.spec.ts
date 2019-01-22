import { TestBed } from "@angular/core/testing";
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
