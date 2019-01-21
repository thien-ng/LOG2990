import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { CreateSimpleGameComponent } from "./create-simple-game.component";

const OBLIGATORY_CATCH: String = "obligatory catch";

describe("CreateSimpleGameComponent", () => {
  let component: CreateSimpleGameComponent;
  let fixture: ComponentFixture<CreateSimpleGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSimpleGameComponent ],
      imports: [TestingImportsModule],
    })
    .compileComponents()
    .catch(() => OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateSimpleGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
