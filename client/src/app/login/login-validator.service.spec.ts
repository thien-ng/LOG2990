import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import "rxjs/add/observable/of";
import "rxjs/add/operator/toPromise";
import { mock } from "ts-mockito";
import { Message } from "../../../../common/communication/message";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { LoginValidatorService } from "./login-validator.service";

// tslint:disable:no-any no-floating-promises

let loginValidatorService:  LoginValidatorService;
let httpClient:             HttpClient;

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

  it("should call generate a message when adding username", () => {
    spyOn<any>(loginValidatorService, "generateMessage");

    loginValidatorService.addUsername("validUsername");
    expect(loginValidatorService["generateMessage"]).toHaveBeenCalled();
  });

  it("should generate a Message", () => {
    const message: Message = loginValidatorService["generateMessage"]("Michel");
    expect(message.body).toBe("Michel");
  });
  it("should capitalize first letter of a word", () => {
    const username: string = "arthur";
    const capitalizedUsername: string = loginValidatorService.capitalizeFirstLetter(username);
    expect(capitalizedUsername[0] === "A").toEqual(true);
  });
  it("should capitalize first letter of a word", () => {
    const username: string = "arthur";
    const capitalizedUsername: string = loginValidatorService.capitalizeFirstLetter(username);
    expect(capitalizedUsername[0] === "a").toEqual(false);
  });
});
