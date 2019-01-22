import { TestBed } from "@angular/core/testing";

import { LoginValidatorService } from "./login-validator.service";

describe("LoginValidatorService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: LoginValidatorService = TestBed.get(LoginValidatorService);
    expect(service).toBeTruthy();
  });

  // it("should refuse other character than alphanumericals", () => {
  //   const service: LoginValidatorService = TestBed.get(LoginValidatorService);
  //   service.usernameFormControl.value = "BadName@";
  //   expect(service.addUsername()).toBeFalsy();
  // });
});
