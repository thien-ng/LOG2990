import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CardComponent } from "../card/card.component";
import { Constants } from "../constants";
import { HighscoreDisplayComponent } from "../highscore-display/highscore-display.component";
import { GameListComponent } from "./game-list.component";

import { TestingImportsModule } from "../testing-imports/testing-imports.module";

describe("GameListComponent", () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({

      declarations: [
        GameListComponent,
        CardComponent,
        HighscoreDisplayComponent,
      ],
      imports: [TestingImportsModule],
    })
      .compileComponents()
      .catch(() => Constants.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
