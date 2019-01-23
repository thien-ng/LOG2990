import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Constants } from "../constants";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { MainNavComponent } from "./main-nav.component";

describe("MainNavComponent", () => {
  let component: MainNavComponent;
  let fixture: ComponentFixture<MainNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainNavComponent,
      ],
      imports: [TestingImportsModule],
    })
      .compileComponents()
      .catch(() => Constants.OBLIGATORY_CATCH);
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
