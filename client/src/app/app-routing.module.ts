import { NgModule } from "@angular/core";
import { RouterModule, RouterOutlet, Routes } from "@angular/router";

import { AdminComponent } from "./admin/admin.component";
import { GameListComponent } from "./game-list/game-list.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { MainNavComponent } from "./main-nav/main-nav.component";

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
      { path: GAMELIST_PATH, component: GameListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterOutlet],
})
export class AppRoutingModule { }
