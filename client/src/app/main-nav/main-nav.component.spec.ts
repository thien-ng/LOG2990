import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";

import { MainNavComponent } from "./main-nav.component";

const OBLIGATORY_CATCH: String = "obligatory catch";

describe("MainNavComponent", () => {
  let component: MainNavComponent;
  let fixture: ComponentFixture<MainNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainNavComponent],
      imports: [
        BrowserAnimationsModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        RouterTestingModule,
        MatIconModule,
      ],
    })
      .compileComponents()
      .catch(() => OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
