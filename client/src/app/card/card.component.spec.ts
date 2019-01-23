import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Constants } from "../constants";
import { HighscoreDisplayComponent } from "../highscore-display/highscore-display.component";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { CardComponent } from "./card.component";

describe("CardComponent", () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardComponent, HighscoreDisplayComponent ],
      imports: [
        TestingImportsModule,
      ],
    })
    .compileComponents()
    .catch(() => Constants.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
