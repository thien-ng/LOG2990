import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatExpansionModule } from "@angular/material";

import { HighscoreDisplayComponent } from "./highscore-display.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("HighscoreDisplayComponent", () => {
  let component: HighscoreDisplayComponent;
  let fixture: ComponentFixture<HighscoreDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HighscoreDisplayComponent ],
      imports: [ MatExpansionModule, BrowserAnimationsModule ],
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
