import { LayoutModule } from "@angular/cdk/layout";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, RouterOutlet, Routes } from "@angular/router";

import { CClient } from "./CClient";
import { AppComponent } from "./app.component";
import { CardComponent } from "./card/card.component";
import { ConfirmationDialogComponent } from "./card/confirmation-dialog/confirmation-dialog.component";
import { CreateFreeGameComponent } from "./create-free-game/create-free-game.component";
import { CreateSimpleGameComponent } from "./create-simple-game/create-simple-game.component";
import { GameListContainerComponent } from "./game-list-container/game-list-container.component";
import { GameListComponent } from "./game-list/game-list.component";
import { ChatViewComponent } from "./game-view/chat-view/chat-view.component";
import { MessageViewComponent } from "./game-view/chat-view/message-view/message-view.component";
import { DifferenceCounterComponent } from "./game-view/difference-counter/difference-counter.component";
import { EndGameDialogComponent } from "./game-view/endGameDialog/end-game-dialog/end-game-dialog.component";
import { GameViewFreeComponent } from "./game-view/game-view-free/game-view-free.component";
import { TheejsViewComponent } from "./game-view/game-view-free/threejs-view/threejs-view.component";
import { GameViewSimpleComponent } from "./game-view/game-view-simple/game-view-simple.component";
import { TimerComponent } from "./game-view/timer/timer.component";
import { HighscoreDisplayComponent } from "./highscore-display/highscore-display.component";
import { LoginPageComponent } from "./login/login-page/login-page.component";
import { LoginValidatorComponent } from "./login/login-validator/login-validator.component";
import { LoginViewComponent } from "./login/login-view/login-view.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { SpinnerComponent } from "./spinner/spinner.component";
import { TestingImportsModule } from "./testing-imports/testing-imports.module";
import { WaitingRoomComponent } from "./waiting-room/waiting-room.component";

const routes: Routes = [
  {
    path:         CClient.ROOT_PATH,
    redirectTo:   CClient.LOGIN_PATH,
    pathMatch:    CClient.PATH_MATCH_FULL,
  },
  {
    path:         CClient.LOGIN_PATH,
    component:    LoginPageComponent,
  },
  {
    path:         CClient.NAV_PATH,
    component:    MainNavComponent,
    children: [
      {
        path:         CClient.ROOT_PATH,
        redirectTo:   CClient.LOGIN_REDIRECT,
        pathMatch:    CClient.PATH_MATCH_FULL,
      },
      {
        path:         CClient.GAMELIST_PATH,
        component:    GameListContainerComponent,
      },
      {
        path:         CClient.ADMIN_PATH,
        component:    GameListContainerComponent,
      },
      {
        path:         CClient.GAME_VIEW_SIMPLE,
        component:    GameViewSimpleComponent,
      },
      {
        path:         CClient.GAME_VIEW_FREE,
        component:    GameViewFreeComponent,
      },
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
    DifferenceCounterComponent,
    TimerComponent,
    ChatViewComponent,
    MessageViewComponent,
    TheejsViewComponent,
    WaitingRoomComponent,
    SpinnerComponent,
    ConfirmationDialogComponent,
    EndGameDialogComponent,
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
    ConfirmationDialogComponent,
    CreateSimpleGameComponent,
    CreateFreeGameComponent,
    EndGameDialogComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
