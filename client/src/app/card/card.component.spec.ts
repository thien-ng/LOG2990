import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule, MatCardModule, MatExpansionModule, MatMenuModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HighscoreDisplayComponent } from "../highscore-display/highscore-display.component";
import { CardComponent } from "./card.component";

describe("CardComponent", () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardComponent, HighscoreDisplayComponent ],
      imports: [
        MatButtonModule, MatCardModule, MatMenuModule, MatExpansionModule, BrowserAnimationsModule,
      ],
    })
    .compileComponents()
    .catch(() => "obligatory catch");
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
