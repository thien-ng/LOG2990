import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { GameListContainerComponent } from "./game-list-container.component";

const OBLIGATORY_CATCH: String = "obligatory catch";

describe("GameListContainerComponent", () => {
  let component: GameListContainerComponent;
  let fixture: ComponentFixture<GameListContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameListContainerComponent ],
      imports: [
        TestingImportsModule,
      ],
    })
    .compileComponents()
    .catch(() => OBLIGATORY_CATCH);
    }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameListContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
