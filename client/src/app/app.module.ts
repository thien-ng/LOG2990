import { LayoutModule } from "@angular/cdk/layout";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule, MatFormFieldModule, MatInputModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, RouterOutlet, Routes } from "@angular/router";

import { BasicService } from "./basic.service";

import { AdminComponent } from "./admin/admin.component";
import { AppComponent } from "./app.component";
import { CardComponent } from "./card/card.component";
import { CreateSimpleGameComponent } from "./create-simple-game/create-simple-game.component";
import { GameListContainerComponent } from "./game-list-container/game-list-container.component";
import { GameListComponent } from "./game-list/game-list.component";
import { HighscoreDisplayComponent } from "./highscore-display/highscore-display.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { TestingImportsModule } from "./testing-imports/testing-imports.module";

const LOGIN_REDIRECT: string = "/login";
const LOGIN_PATH: string = "login";
const ADMIN_PATH: string = "admin";
const ROOT_PATH: string = "";
const NAV_PATH: string = "nav";
const GAMELIST_PATH: string = "gamelist";

const routes: Routes = [
  { path: ROOT_PATH, redirectTo: LOGIN_REDIRECT, pathMatch: "full" },
  { path: LOGIN_PATH, component: LoginPageComponent },
  { path: ADMIN_PATH, component: AdminComponent },
  {
    path: NAV_PATH,
    component: MainNavComponent,
    children: [
      { path: ROOT_PATH, redirectTo: GAMELIST_PATH, pathMatch: "full" },
      { path: GAMELIST_PATH, component: GameListContainerComponent },
    ],
  },
];

@NgModule({
  declarations: [
    AppComponent,
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
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
  ],
  exports: [RouterOutlet],
  entryComponents: [CreateSimpleGameComponent],
  providers: [
    BasicService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
