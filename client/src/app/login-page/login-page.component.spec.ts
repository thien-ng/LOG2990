import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { LoginPageComponent } from "./login-page.component";

const OBLIGATORY_CATCH: String = "obligatory catch";

describe("LoginPageComponent", () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPageComponent],
      imports: [TestingImportsModule],
    })
      .compileComponents()
      .catch(() => OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
