import { TestBed } from "@angular/core/testing";

import { DiffCounterService } from "./diff-counter.service";

describe("DiffCounterService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: DiffCounterService = TestBed.get(DiffCounterService);
    expect(service).toBeTruthy();
  });
});
