// tslint:disable:no-any les attributs sont des types any
// tslint:disable:no-floating-promises pour le before each
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule, MatCardModule, MatExpansionModule, MatMenuModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AppComponent } from "./app.component";
import { BasicService } from "./basic.service";
import { CardComponent } from "./card/card.component";
import { HighscoreDisplayComponent } from "./highscore-display/highscore-display.component";

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        CardComponent,
        HighscoreDisplayComponent,
      ],
      imports: [HttpClientModule, MatButtonModule, MatCardModule, MatExpansionModule, MatMenuModule, BrowserAnimationsModule, ],
      providers: [BasicService],
    }).compileComponents();
  }));
  it("should create the app", async(() => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: any = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'client'`, async(() => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: any = fixture.debugElement.componentInstance;
    expect(app.title).toEqual("LOG2990");
  }));
});
