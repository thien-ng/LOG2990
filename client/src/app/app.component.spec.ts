// tslint:disable:no-any les attributs sont des types any
// tslint:disable:no-floating-promises pour le before each
import { LayoutModule } from "@angular/cdk/layout";
import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule, MatCardModule, MatExpansionModule, MatMenuModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { CardComponent } from "./card/card.component";
import { HighscoreDisplayComponent } from "./highscore-display/highscore-display.component";

import { AdminComponent } from "./admin/admin.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BasicService } from "./basic.service";
import { GameListComponent } from "./game-list/game-list.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { TestingImportsModule } from "./testing-imports/testing-imports.module";

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminComponent,
        AppComponent,
        CardComponent,
        HighscoreDisplayComponent,
        GameListComponent,
        LoginPageComponent,
        MainNavComponent,
      ],
      imports: [
        HttpClientModule,
        MatButtonModule,
        MatCardModule,
        MatExpansionModule,
        MatMenuModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        BrowserModule,
        HttpClientModule,
        LayoutModule,
        RouterModule,
        TestingImportsModule,
      ],
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
