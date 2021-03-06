import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CClient } from "../CClient";
import { CardComponent } from "../card/card.component";
import { GameListComponent } from "../game-list/game-list.component";
import { HighscoreDisplayComponent } from "../highscore-display/highscore-display.component";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { GameListContainerComponent } from "./game-list-container.component";

describe("GameListContainerComponent", () => {
  let fixture:    ComponentFixture<GameListContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        GameListContainerComponent,
        GameListComponent,
        CardComponent,
        HighscoreDisplayComponent,
      ],
      imports: [
        TestingImportsModule,
      ],
    })
    .compileComponents()
    .catch(() => CClient.OBLIGATORY_CATCH);
    }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(GameListContainerComponent);
    fixture.detectChanges();
  });
});
