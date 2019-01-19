import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { HighscoreDisplayComponent } from "./highscore-display.component";

describe("HighscoreDisplayComponent", () => {
  let component: HighscoreDisplayComponent;
  let fixture: ComponentFixture<HighscoreDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighscoreDisplayComponent ],
      imports: [ TestingImportsModule ],
    })
    .compileComponents()
    .catch(() => "obligatory catch");
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighscoreDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
