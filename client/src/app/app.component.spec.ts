// tslint:disable:no-any les attributs sont des types any
// tslint:disable:no-floating-promises pour le before each
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LayoutModule } from "@angular/cdk/layout";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { AppRoutingModule } from "./app-routing.module";
import { TestingImportsModule } from "./testing-imports/testing-imports.module";

import { BasicService } from "./basic.service";

import { AdminComponent } from "./admin/admin.component";
import { AppComponent } from "./app.component";
import { CardComponent } from "./card/card.component";
import { GameListContainerComponent } from "./game-list-container/game-list-container.component";
import { GameListComponent } from "./game-list/game-list.component";
import { HighscoreDisplayComponent } from "./highscore-display/highscore-display.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { MainNavComponent } from "./main-nav/main-nav.component";

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
        GameListContainerComponent,
      ],
      imports: [
        HttpClientModule,
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
