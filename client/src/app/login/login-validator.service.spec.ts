import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { mock } from "ts-mockito";
import { LoginValidatorService } from "./login-validator.service";

import { Message } from "../../../../common/communication/message";
import { Constants } from "../constants";
import { SocketService } from "../socket.service";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { Validators } from "@angular/forms";

let loginValidatorService: LoginValidatorService;
let router: Router;
let httpClient: HttpClient;
let socketService: SocketService;
let snackBar: MatSnackBar;

beforeEach(() => {
  router = mock(Router);
  httpClient = mock(HttpClient);
  socketService = mock(SocketService);
  snackBar = mock(MatSnackBar);

  loginValidatorService = new LoginValidatorService(router, snackBar, httpClient, socketService );
});

fdescribe("Tests on LoginValidatorService", () => {

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
    loginValidatorService.usernameFormControl.setValue("12345678");
    expect(loginValidatorService.usernameFormControl.valid).toBeTruthy();
  });

  it("should be invalid when form has more than 15 chars", () => {
    loginValidatorService.usernameFormControl.setValue("1234567890123456");
    expect(loginValidatorService.usernameFormControl.valid).toBeFalsy();
  });

  it("should be invalid when form has space characters", () => {
    loginValidatorService.usernameFormControl.setValue("test with space");
    expect(loginValidatorService.usernameFormControl.valid).toBeFalsy();
  });

  it("should be invalid when form has special character", () => {
    loginValidatorService.usernameFormControl.setValue("test@");
    expect(loginValidatorService.usernameFormControl.valid).toBeFalsy();
  });

  it("should be invalid when form has punctuation", () => {
    loginValidatorService.usernameFormControl.setValue("t.e.s.t");
    expect(loginValidatorService.usernameFormControl.valid).toBeFalsy();
  });

  // Test on the helpers

  it("should return false when form has no errors", () => {
    loginValidatorService["usernameFormControl"].setErrors(null);
    expect(loginValidatorService["hasErrors"]).toBeFalsy();
  });

  it("should return true when form has errors", () => {
    loginValidatorService["usernameFormControl"].setErrors(Validators.required);
    expect(loginValidatorService["hasErrors"]).toBeTruthy();
  });

  it("should generate a Message with the username", () => {
    const message: Message = loginValidatorService["generateMessage"]("dylan");
    expect(message).toEqual({
      title: "new username",
      body: "dylan",
    });
  });

});
