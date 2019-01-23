import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { Is2Dor3DService } from "./is2-dor3-d.service";

describe("Is2Dor3DService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [Is2Dor3DService],
    imports: [
      RouterTestingModule,
    ],
  }));

  it("should be created", () => {
    const service: Is2Dor3DService = TestBed.get(Is2Dor3DService);
    expect(service).toBeTruthy();
  });
});
