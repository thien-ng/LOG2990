import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { LoginValidatorComponent } from "../login-validator/login-validator.component";
import { LoginViewComponent } from "./login-view.component";
import { TestingImportsModule } from "../../testing-imports/testing-imports.module";

describe("LoginViewComponent", () => {
  let component: LoginViewComponent;
  let fixture: ComponentFixture<LoginViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        LoginViewComponent,
        LoginValidatorComponent,
      ],
      imports: [
        TestingImportsModule,
      ],
    })
    .compileComponents().catch();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
