import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";

import { LoginValidatorService } from "./login-validator.service";

describe("LoginValidatorService", () => {

  let component: LoginValidatorService;
  let fixture: ComponentFixture<LoginValidatorService>;

  beforeEach(() => {

  TestBed.configureTestingModule({
    providers: [LoginValidatorService],
    imports: [
      RouterTestingModule,
      TestingImportsModule,
    ],
    declarations: [LoginValidatorService],
  });

  fixture = TestBed.createComponent(LoginValidatorService);

  component = fixture.componentInstance;
  });

  it("should be created", () => {
    const service: LoginValidatorService = TestBed.get(LoginValidatorService);
    expect(service).toBeTruthy();
  });

  it("form invalid when empty", () => {
    component._usernameFormControl.setValue("");
    expect(component._usernameFormControl.valid).toBeFalsy();
  });

});
