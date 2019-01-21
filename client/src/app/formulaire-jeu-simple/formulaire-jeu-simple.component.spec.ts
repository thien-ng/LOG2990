import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { FormulaireJeuSimpleComponent } from "./formulaire-jeu-simple.component";

const OBLIGATORY_CATCH: String = "obligatory catch";

describe("FormulaireJeuSimpleComponent", () => {
  let component: FormulaireJeuSimpleComponent;
  let fixture: ComponentFixture<FormulaireJeuSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormulaireJeuSimpleComponent ],
      imports: [TestingImportsModule],
    })
    .compileComponents()
    .catch(() => OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormulaireJeuSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
