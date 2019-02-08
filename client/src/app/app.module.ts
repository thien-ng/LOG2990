import { LayoutModule } from "@angular/cdk/layout";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, RouterOutlet, Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { CardComponent } from "./card/card.component";
import { Constants } from "./constants";
import { CreateFreeGameComponent } from "./create-free-game/create-free-game.component";
import { CreateSimpleGameComponent } from "./create-simple-game/create-simple-game.component";
import { GameListContainerComponent } from "./game-list-container/game-list-container.component";
import { GameListComponent } from "./game-list/game-list.component";
import { GameViewComponent } from "./game-view/game-view.component";
import { HighscoreDisplayComponent } from "./highscore-display/highscore-display.component";
import { LoginPageComponent } from "./login/login-page/login-page.component";
import { LoginValidatorComponent } from "./login/login-validator/login-validator.component";
import { LoginViewComponent } from "./login/login-view/login-view.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { TestingImportsModule } from "./testing-imports/testing-imports.module";

const routes: Routes = [
  { path: Constants.ROOT_PATH, redirectTo: Constants.NAV_PATH, pathMatch: Constants.PATH_MATCH_FULL },
  {
    path: Constants.NAV_PATH,
    component: MainNavComponent,
    children: [
      { path: Constants.ROOT_PATH, redirectTo: Constants.LOGIN_REDIRECT, pathMatch: Constants.PATH_MATCH_FULL },
      { path: Constants.LOGIN_PATH, component: LoginPageComponent },
      { path: Constants.GAMELIST_PATH, component: GameListContainerComponent },
      { path: Constants.ADMIN_PATH, component: GameListContainerComponent },
      { path: Constants.GAME_VIEW, component: GameViewComponent},
    ],
  },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginViewComponent,
    LoginValidatorComponent,
    CardComponent,
    HighscoreDisplayComponent,
    GameListComponent,
    MainNavComponent,
    LoginPageComponent,
    GameListComponent,
    GameListContainerComponent,
    CreateSimpleGameComponent,
    GameViewComponent,
    CreateFreeGameComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    HttpClientModule,
    LayoutModule,
    RouterModule,
    TestingImportsModule,
    BrowserModule,
  ],
  exports: [RouterOutlet],
  entryComponents: [
    CreateSimpleGameComponent,
    CreateFreeGameComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
