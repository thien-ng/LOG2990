// tslint:disable:no-any les attributs sont des types any
// tslint:disable:no-floating-promises pour le before each
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule, MatFormFieldModule, MatInputModule } from "@angular/material";
import { AppComponent } from "./app.component";
import { BasicService } from "./basic.service";
import { LoginValidatorComponent } from "./login-validator/login-validator.component";
import { LoginViewComponent } from "./login-view/login-view.component";
describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LoginValidatorComponent,
        LoginViewComponent,
      ],
      imports: [
                FormsModule,
                HttpClientModule,
                MatButtonModule,
                MatFormFieldModule,
                MatInputModule,
                ReactiveFormsModule,
              ],
      providers: [BasicService],
    }).compileComponents();
  }));
  it("should create the app", async(() => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: any = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'client'`, async(() => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: any = fixture.debugElement.componentInstance;
    expect(app.title).toEqual("LOG2990");
  }));
});
