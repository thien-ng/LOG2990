import { TestBed } from "@angular/core/testing";

import { DifferenceCounterService } from "./difference-counter.service";

describe("DifferenceCounterService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: DifferenceCounterService = TestBed.get(DifferenceCounterService);
    expect(service).toBeTruthy();
  });
});
