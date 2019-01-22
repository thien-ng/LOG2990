import { LayoutModule } from "@angular/cdk/layout";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, RouterOutlet, Routes } from "@angular/router";

import { BasicService } from "./basic.service";

import { AdminComponent } from "./admin/admin.component";
import { AppComponent } from "./app.component";
import { CardComponent } from "./card/card.component";
import { Constants } from "./constants";
import { CreateSimpleGameComponent } from "./create-simple-game/create-simple-game.component";
import { GameListContainerComponent } from "./game-list-container/game-list-container.component";
import { GameListComponent } from "./game-list/game-list.component";
import { HighscoreDisplayComponent } from "./highscore-display/highscore-display.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { LoginValidatorComponent } from "./login/login-validator/login-validator.component";
import { LoginViewComponent } from "./login/login-view/login-view.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { TestingImportsModule } from "./testing-imports/testing-imports.module";

const routes: Routes = [
  { path: Constants.ROOT_PATH, redirectTo: Constants.NAV_PATH, pathMatch: "full" },
  {
    path: Constants.NAV_PATH,
    component: MainNavComponent,
    children: [
      { path: Constants.ROOT_PATH, redirectTo: Constants.LOGIN_REDIRECT, pathMatch: "full" },
      { path: Constants.LOGIN_PATH, component: LoginPageComponent },
      { path: Constants.GAMELIST_PATH, component: GameListContainerComponent },
      { path: Constants.ADMIN_PATH, component: AdminComponent },
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
    AdminComponent,
    GameListContainerComponent,
    CreateSimpleGameComponent,
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
  entryComponents: [CreateSimpleGameComponent],
  providers: [
    BasicService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
