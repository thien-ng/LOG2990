import { TestBed } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { mock } from "ts-mockito";
import { LoginValidatorService } from "./login-validator.service";

import { SocketService } from "../socket.service";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";

let loginValidatorService: LoginValidatorService;
let router: Router;
let socketService: SocketService;
let snackBar: MatSnackBar;

beforeEach(() => {
  router = mock(Router);
  socketService = mock(SocketService);
  snackBar = mock(MatSnackBar);
  loginValidatorService = new LoginValidatorService(router, snackBar, socketService );
});

describe("Tests on LoginValidatorService", () => {

  beforeEach(() => {

  TestBed.configureTestingModule({
    imports: [
      RouterTestingModule,
      TestingImportsModule,
    ],
  });

  });

  it("should be invalid when form empty", () => {
    loginValidatorService.usernameFormControl.setValue("");
    expect(loginValidatorService.usernameFormControl.valid).toBeFalsy();
  });

  it("should be invalid when form has less than 4 chars", () => {
    loginValidatorService.usernameFormControl.setValue("123");
    expect(loginValidatorService.usernameFormControl.valid).toBeFalsy();
  });

  it("should be valid when form has between 4-15 chars (inclusive)", () => {
    loginValidatorService.usernameFormControl.setValue("12345");
    expect(loginValidatorService.usernameFormControl.valid).toBeTruthy();

    loginValidatorService.usernameFormControl.setValue("12345678");
    expect(loginValidatorService.usernameFormControl.valid).toBeTruthy();

    loginValidatorService.usernameFormControl.setValue("12345678901234");
    expect(loginValidatorService.usernameFormControl.valid).toBeTruthy();

    loginValidatorService.usernameFormControl.setValue("123456789012345");
    expect(loginValidatorService.usernameFormControl.valid).toBeTruthy();
  });

  it("should be invalid when form has more than 15 chars", () => {
    loginValidatorService.usernameFormControl.setValue("1234567890123456");
    expect(loginValidatorService.usernameFormControl.valid).toBeFalsy();
  });

  it("should be invalid when form has chars other than alphanumericals", () => {
    loginValidatorService.usernameFormControl.setValue("test with space");
    expect(loginValidatorService.usernameFormControl.valid).toBeFalsy();

    loginValidatorService.usernameFormControl.setValue("test.test");
    expect(loginValidatorService.usernameFormControl.valid).toBeFalsy();

    loginValidatorService.usernameFormControl.setValue("test@");
    expect(loginValidatorService.usernameFormControl.valid).toBeFalsy();
  });

});
