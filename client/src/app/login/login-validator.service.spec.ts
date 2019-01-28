import { TestBed } from "@angular/core/testing";
import {FormControl, Validators} from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";

import { Constants } from "../constants";

class MockLoginValidatorService {

  public _usernameFormControl: FormControl = new FormControl("", [
    Validators.required,
    Validators.pattern(Constants.REGEX_PATTERN),
    Validators.minLength(Constants.MIN_LENGTH),
    Validators.maxLength(Constants.MAX_LENGTH),
  ]);

  public addUsername(): Boolean {
    if (this._usernameFormControl.errors == null) {
      return true;
    }

    return false;
  }
}

describe("Tests on LoginValidatorService", () => {

  let service: MockLoginValidatorService;

  beforeEach(() => {

  TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
      TestingImportsModule,
    ],
  });

  service = new MockLoginValidatorService();
  });

  it("should be invalid when form empty", () => {
    service._usernameFormControl.setValue("");
    expect(service._usernameFormControl.valid).toBeFalsy();
  });

  it("should be invalid when form has less than 4 chars", () => {
    service._usernameFormControl.setValue("123");
    expect(service._usernameFormControl.valid).toBeFalsy();
  });

  it("should be valid when form has between 4-15 chars (inclusive)", () => {
    service._usernameFormControl.setValue("12345");
    expect(service._usernameFormControl.valid).toBeTruthy();

    service._usernameFormControl.setValue("12345678");
    expect(service._usernameFormControl.valid).toBeTruthy();

    service._usernameFormControl.setValue("12345678901234");
    expect(service._usernameFormControl.valid).toBeTruthy();

    service._usernameFormControl.setValue("123456789012345");
    expect(service._usernameFormControl.valid).toBeTruthy();
  });

  it("should be invalid when form has more than 15 chars", () => {
    service._usernameFormControl.setValue("1234567890123456");
    expect(service._usernameFormControl.valid).toBeFalsy();
  });

  it("should be invalid when form has chars other than alphanumericals", () => {
    service._usernameFormControl.setValue("test@");
    expect(service._usernameFormControl.valid).toBeFalsy();
  });

  it("should be invalid when form has chars other than alphanumericals", () => {
    service._usernameFormControl.setValue("test with space");
    expect(service._usernameFormControl.valid).toBeFalsy();
  });

  it("should be invalid when form has chars other than alphanumericals", () => {
    service._usernameFormControl.setValue("test.test");
    expect(service._usernameFormControl.valid).toBeFalsy();
  });

});
