import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GameListComponent } from "./game-list.component";

const OBLIGATORY_CATCH: String = "obligatory catch";

describe("GameListComponent", () => {
  let component: GameListComponent;
  let fixture: ComponentFixture<GameListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GameListComponent],
    })
      .compileComponents()
      .catch(() => OBLIGATORY_CATCH);
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
