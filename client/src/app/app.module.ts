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
import { ChatViewComponent } from "./game-view/chat-view/chat-view.component";
import { MessageViewComponent } from "./game-view/chat-view/message-view/message-view.component";
import { GameViewFreeComponent } from "./game-view/game-view-free/game-view-free.component";
import { GameViewSimpleComponent } from "./game-view/game-view-simple/game-view-simple.component";
import { HighscoreDisplayComponent } from "./highscore-display/highscore-display.component";
import { LoginPageComponent } from "./login/login-page/login-page.component";
import { LoginValidatorComponent } from "./login/login-validator/login-validator.component";
import { LoginViewComponent } from "./login/login-view/login-view.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { TestingImportsModule } from "./testing-imports/testing-imports.module";

const routes: Routes = [
  { path: Constants.ROOT_PATH, redirectTo: Constants.LOGIN_PATH, pathMatch: Constants.PATH_MATCH_FULL },
  { path: Constants.LOGIN_PATH, component: LoginPageComponent },
  {
    path: Constants.NAV_PATH,
    component: MainNavComponent,
    children: [
      { path: Constants.ROOT_PATH, redirectTo: Constants.LOGIN_REDIRECT, pathMatch: Constants.PATH_MATCH_FULL },
      { path: Constants.GAMELIST_PATH, component: GameListContainerComponent },
      { path: Constants.ADMIN_PATH, component: GameListContainerComponent },
      { path: Constants.GAME_VIEW_SIMPLE, component: GameViewSimpleComponent },
      { path: Constants.GAME_VIEW_FREE, component: GameViewFreeComponent },
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
    GameViewSimpleComponent,
    GameViewFreeComponent,
    CreateFreeGameComponent,
    ChatViewComponent,
    MessageViewComponent,
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
