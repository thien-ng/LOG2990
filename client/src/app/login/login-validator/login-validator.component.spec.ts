import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { Constants } from "src/app/constants";
import { TestingImportsModule } from "../../testing-imports/testing-imports.module";
import { LoginValidatorComponent } from "./login-validator.component";

describe("LoginValidatorComponent", () => {
  let component: LoginValidatorComponent;
  let fixture: ComponentFixture<LoginValidatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginValidatorComponent,
       ],
      imports: [
        TestingImportsModule,
        RouterTestingModule,
      ],
    })
    .compileComponents().catch(() => Constants.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
