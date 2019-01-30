import { TestBed } from "@angular/core/testing";

import { CardManagerService } from "./card-manager.service";
import { TestingImportsModule } from "./testing-imports/testing-imports.module";

describe("CardManager.ServiceService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [TestingImportsModule],
  }));

  it("should be created", () => {
    const service: CardManagerService = TestBed.get(CardManagerService);
    expect(service).toBeTruthy();
  });
});
