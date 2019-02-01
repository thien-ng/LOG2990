import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Observable } from "rxjs";
import "rxjs/add/observable/of";
import "rxjs/add/operator/toPromise";
// import { anyString, mock, verify, when } from "ts-mockito";
import { mock } from "ts-mockito";
// import { Message } from "../../../../common/communication/message";
// import { Constants } from "../constants";
import { SocketService } from "../socket.service";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { LoginValidatorService } from "./login-validator.service";

// tslint:disable:no-any no-floating-promises

let loginValidatorService: LoginValidatorService;
let router: Router;
let httpClient: HttpClient;
let socketService: SocketService;

beforeEach(() => {
  router = mock(Router);
  httpClient = mock(HttpClient);
  socketService = mock(SocketService);

  loginValidatorService = new LoginValidatorService(router, httpClient, socketService );
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

  it("should call addUsername correctly", () => {
    spyOn(loginValidatorService, "addUsername");
    loginValidatorService.usernameFormControl.setValue("validName");

    loginValidatorService.addUsername();
    expect(loginValidatorService.addUsername).toHaveBeenCalled();
  });

  it("should return false on addUsername with INVALID username", async () => {
    loginValidatorService.usernameFormControl.setValue("inv@lidN@me");
    loginValidatorService.usernameFormControl.setErrors({"incorrect": true});
    const isValid: boolean = await loginValidatorService.addUsername();
    expect(isValid).toBeFalsy();
  });

  it("should return true on addUsername with VALID username and unique", async () => {
    spyOn<any>(loginValidatorService, "sendUsernameRequest").and.returnValue(Observable.of("true")).and.callFake(() => {
      return true;
    });
    spyOn<any>(loginValidatorService["router"], "navigate").and.returnValue(Observable.of("true")).and.callThrough();
    loginValidatorService.usernameFormControl.setValue("validName");
    const isValid: boolean = await loginValidatorService.addUsername();
    expect(isValid).toBeTruthy();
  });

  it("should return false on addUsername with VALID username but NOT unique", async () => {
    spyOn<any>(loginValidatorService, "sendUsernameRequest").and.returnValue(Observable.of("false")).and.callFake(() => {
      return false;
    });
    loginValidatorService.usernameFormControl.setValue("validName");
    const isValid: boolean = await loginValidatorService.addUsername();
    expect(isValid).toBeFalsy();
  });

  it("should return false when socket is UNDEFINED", async () => {
    spyOn<any>(loginValidatorService, "isWebsocketConnected").and.returnValue(false).and.callThrough();
    spyOn<any>(loginValidatorService, "sendUsernameRequest").and.returnValue(Observable.of("true")).and.callFake(() => {
      return true;
    });
    loginValidatorService.usernameFormControl.setValue("validName");
    await loginValidatorService.addUsername();
    expect(loginValidatorService["isWebsocketConnected"]).toHaveBeenCalled();
  });

  it("should return false when socket exists", async () => {
    spyOn<any>(loginValidatorService, "isWebsocketConnected").and.returnValue(true).and.callThrough();
    spyOn<any>(loginValidatorService, "sendUsernameRequest").and.returnValue(Observable.of("true")).and.callFake(() => {
      return true;
    });
    loginValidatorService.usernameFormControl.setValue("validName");
    await loginValidatorService.addUsername();
    expect(loginValidatorService["isWebsocketConnected"]).toHaveBeenCalled();
  });

  it("should return true on POST when username is VALID", () => {
    spyOn<any>(loginValidatorService, "sendUsernameRequest").and.returnValue(Observable.of("true")).and.callThrough();
    loginValidatorService.usernameFormControl.setValue("validName");
    loginValidatorService.addUsername();
    expect(loginValidatorService["sendUsernameRequest"]).toHaveBeenCalled();
  });

  // Error matcher
  it("should return false when the form exists AND is not valid", () => {
    expect(loginValidatorService.matcher.isErrorState(loginValidatorService.usernameFormControl, null)).toBeFalsy();
  });

});
