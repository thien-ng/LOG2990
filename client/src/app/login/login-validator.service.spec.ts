import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";

import { LoginValidatorService } from "./login-validator.service";

describe("LoginValidatorService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [LoginValidatorService],
    imports: [
      RouterTestingModule,
      TestingImportsModule,
    ],
  }));

  it("should be created", () => {
    const service: LoginValidatorService = TestBed.get(LoginValidatorService);
    expect(service).toBeTruthy();
  });

});
