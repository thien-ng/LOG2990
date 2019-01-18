import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MatListModule, MatSidenavModule, MatToolbarModule } from "@angular/material";
import { MainNavComponent } from "./main-nav.component";

describe("MainNavComponent", () => {
  let component: MainNavComponent;
  let fixture: ComponentFixture<MainNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainNavComponent],
      imports: [
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
      ],

    })
      .compileComponents()
      .catch(() => "obligatory catch");
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
