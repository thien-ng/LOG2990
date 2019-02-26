import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Constants } from "../constants";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { HighscoreDisplayComponent } from "./highscore-display.component";
import { HighscoreService } from "./highscore.service";

describe("HighscoreDisplayComponent", () => {
  let component:  HighscoreDisplayComponent;
  let fixture:    ComponentFixture<HighscoreDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighscoreDisplayComponent ],
      imports: [
        TestingImportsModule,
      ],
      providers: [
        HighscoreService,
      ],
    })
    .compileComponents()
    .catch(() => Constants.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(HighscoreDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
