import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Observable } from "rxjs";
import "rxjs/add/observable/of";
import "rxjs/add/operator/toPromise";
import { mock } from "ts-mockito";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { LoginValidatorService } from "./login-validator.service";

// tslint:disable:no-any no-floating-promises

let loginValidatorService: LoginValidatorService;
let httpClient: HttpClient;

beforeEach(() => {
  httpClient = mock(HttpClient);

  loginValidatorService = new LoginValidatorService( httpClient );
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

  it("should call addUsername correctly", () => {
    spyOn(loginValidatorService, "addUsername");

    loginValidatorService.addUsername("validUsername");
    expect(loginValidatorService.addUsername).toHaveBeenCalled();
  });

  it("should return true on addUsername with VALID username and unique", async () => {
    spyOn<any>(loginValidatorService, "sendUsernameRequest").and.returnValue(Observable.of("true")).and.callThrough();
    spyOn<any>(loginValidatorService, "addUsername");
    expect(loginValidatorService.addUsername("username")).toBe(Observable.of("true"));
  });

  it("should return false on addUsername with VALID username but NOT unique", async () => {
    spyOn<any>(loginValidatorService, "sendUsernameRequest").and.returnValue(Observable.of("false")).and.callThrough();
    spyOn<any>(loginValidatorService, "addUsername");
    expect(loginValidatorService.addUsername("username")).toBe(Observable.of("false"));
  });

});
