import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TestingImportsModule } from "../../testing-imports/testing-imports.module";

import { CClient } from "../../CClient";
import { LoginValidatorComponent } from "../../login/login-validator/login-validator.component";
import { LoginViewComponent } from "../../login/login-view/login-view.component";
import { LoginPageComponent } from "./login-page.component";

describe("LoginPageComponent", () => {
  let component:  LoginPageComponent;
  let fixture:    ComponentFixture<LoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginPageComponent,
        LoginValidatorComponent,
        LoginViewComponent,
      ],
      imports: [TestingImportsModule],
    })
      .compileComponents()
      .catch(() => CClient.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
