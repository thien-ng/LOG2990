import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { LoginValidatorService } from "./login-validator.service";

describe("LoginValidatorService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [LoginValidatorService],
    imports: [RouterTestingModule],
  }));

  it("should be created", () => {
    const service: LoginValidatorService = TestBed.get(LoginValidatorService);
    expect(service).toBeTruthy();
  });
});
