// tslint:disable:no-any no-floating-promises

import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
// import { Observable } from "rxjs";
import "rxjs/add/observable/of";
import "rxjs/add/operator/toPromise";
// import { anyString, mock, verify, when } from "ts-mockito";
import { mock } from "ts-mockito";
// import { Message } from "../../../../common/communication/message";
// import { Constants } from "../constants";
import { SocketService } from "../socket.service";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { LoginValidatorService } from "./login-validator.service";

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

  // it("should call the post request when username is valid", () => {
  //   spyOn<any>(loginValidatorService, "sendUsernameRequest").and.returnValue(Observable.of("true"));
  //   loginValidatorService.usernameFormControl.setValue("validName");
  //   const message: Message = {
  //     title: Constants.LOGIN_MESSAGE_TITLE,
  //     body: loginValidatorService.usernameFormControl.value,
  //   };

  //   let fakeResponse: Object = "fake response";
  //   loginValidatorService["sendUsernameRequest"](message).subscribe((value: any) => {
  //     fakeResponse = value;
  //   });

  //   expect(fakeResponse).toBe("true");
  // });

  // it("should not call httpClient.post if socketService is undefined", () => {
  //   loginValidatorService = new LoginValidatorService(router, snackBar, httpClient, undefined);
  //   loginValidatorService.usernameFormControl.setValue("validName");
  //   loginValidatorService.addUsername();
  //   const message: Message = {
  //     title: Constants.LOGIN_MESSAGE_TITLE,
  //     body: loginValidatorService.usernameFormControl.value,
  //   };
  //   verify(httpClient.post(anyString(), message)).never();
  // });

  // it("should not call httpClient.post if usernameFormControl has error", () => {
  //   loginValidatorService = new LoginValidatorService(router, snackBar, httpClient, socketService);
  //   loginValidatorService.usernameFormControl.setValue("UnvalidName@...");
  //   loginValidatorService.addUsername();
  //   const message: Message = {
  //     title: Constants.LOGIN_MESSAGE_TITLE,
  //     body: loginValidatorService.usernameFormControl.value,
  //   };
  //   verify(httpClient.post(anyString(), message)).never();
  // });

  // it("should not call httpClient.post if usernameFormControl has error and socketService is undefined", () => {
  //   loginValidatorService = new LoginValidatorService(router, snackBar, httpClient, undefined);
  //   loginValidatorService.usernameFormControl.setValue("UnvalidName@...");
  //   loginValidatorService.addUsername();
  //   const message: Message = {
  //     title: Constants.LOGIN_MESSAGE_TITLE,
  //     body: loginValidatorService.usernameFormControl.value,
  //   };
  //   verify(httpClient.post(anyString(), message)).never();
  // });

  // it("should return a observable from post of httpClient", () => {
  //   loginValidatorService.usernameFormControl.setValue("validName");

  //   loginValidatorService.addUsername();
  //   const message: Message = {
  //     title: Constants.LOGIN_MESSAGE_TITLE,
  //     body: loginValidatorService.usernameFormControl.value,
  //   };
  //   // verify(httpClient.post(anyString(), message)).never();
  //   // const returnedValue = Observable.of(true);
  //   // when(httpClient.post(anyString(), message)).thenReturn(Observable.of(false));
  //   // verify(router.navigate([Constants.ROUTER_LOGIN])).called();
  // });

});
