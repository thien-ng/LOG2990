// tslint:disable:no-any les attributs sont des types any
// tslint:disable:no-floating-promises pour le before each
import { async, TestBed } from "@angular/core/testing";

import { LayoutModule } from "@angular/cdk/layout";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { TestingImportsModule } from "./testing-imports/testing-imports.module";

import { CardComponent } from "./card/card.component";
import { CreateSimpleGameComponent } from "./create-simple-game/create-simple-game.component";
import { GameListContainerComponent } from "./game-list-container/game-list-container.component";
import { GameListComponent } from "./game-list/game-list.component";
import { DifferenceCounterComponent } from "./game-view/difference-counter/difference-counter.component";
import { HighscoreDisplayComponent } from "./highscore-display/highscore-display.component";
import { LoginPageComponent } from "./login/login-page/login-page.component";
import { LoginValidatorComponent } from "./login/login-validator/login-validator.component";
import { LoginViewComponent } from "./login/login-view/login-view.component";
import { MainNavComponent } from "./main-nav/main-nav.component";

describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        LoginValidatorComponent,
        LoginViewComponent,
        CardComponent,
        HighscoreDisplayComponent,
        GameListComponent,
        LoginPageComponent,
        MainNavComponent,
        GameListContainerComponent,
        CreateSimpleGameComponent,
        DifferenceCounterComponent,
      ],
      imports: [
        BrowserModule,
        HttpClientModule,
        HttpClientModule,
        LayoutModule,
        TestingImportsModule,
      ],
    }).compileComponents();
  }));

});
