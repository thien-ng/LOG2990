import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormulaireJeuSimpleComponent } from "../formulaire-jeu-simple/formulaire-jeu-simple.component";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { MainNavComponent } from "./main-nav.component";

const OBLIGATORY_CATCH: String = "obligatory catch";

describe("MainNavComponent", () => {
  let component: MainNavComponent;
  let fixture: ComponentFixture<MainNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MainNavComponent,
        FormulaireJeuSimpleComponent,
      ],
      imports: [TestingImportsModule],
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
