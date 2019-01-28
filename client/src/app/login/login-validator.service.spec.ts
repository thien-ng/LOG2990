import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";

import { mock, anyString, when, verify } from "ts-mockito";
import { Router } from "@angular/router";
import { LoginValidatorService } from "./login-validator.service";
import { SocketService } from "../socket.service";
import { MatSnackBar } from "@angular/material";
import { of } from "rxjs";

let service: LoginValidatorService;
let router: Router;
let socketService: SocketService;
let snackBar: MatSnackBar;

beforeEach(() => {
  router = mock(Router);
  socketService = mock(SocketService);
  snackBar = mock(MatSnackBar);
  service = new LoginValidatorService(router, snackBar, socketService );
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
    service._usernameFormControl.setValue("test with space");
    expect(service._usernameFormControl.valid).toBeFalsy();

    service._usernameFormControl.setValue("test.test");
    expect(service._usernameFormControl.valid).toBeFalsy();

    service._usernameFormControl.setValue("test@");
    expect(service._usernameFormControl.valid).toBeFalsy();
  });

  it("should be valid name if socket return true", () => {
    service._usernameFormControl.setValue("dylan");

    // let response: Observable<String> = mock(of("true"));
    when(socketService.onMsg(anyString())).thenReturn(of("true"));

    service.addUsername();
    verify(router.navigate(anyString())).called();
  });

  // it("should be invalid name if socket returns false", () => {
  //   service._usernameFormControl.setValue("dylan");

  //   let response: Observable<String> = mock(Observable);
  //   when(socketService.onMsg(anyString())).thenReturn(response);

  //   service.addUsername();
  //   verify(snackBar.open(anyString(), anyString(), anyOfClass(MatSnackBarConfig))).called();
  // });


});
