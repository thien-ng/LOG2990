import { NgModule } from "@angular/core";
import { RouterModule, RouterOutlet, Routes } from "@angular/router";

import { AdminComponent } from "./admin/admin.component";
import { GameListComponent } from "./game-list/game-list.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { MainNavComponent } from "./main-nav/main-nav.component";

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: "login", component: LoginPageComponent },
  { path: "admin", component: AdminComponent },
  {
    path: "nav",
    component: MainNavComponent,
    children: [
      { path: "", redirectTo: "gamelist", pathMatch: "full" },
      { path: "gamelist", component: GameListComponent },
      // { path: "admin", component: AdminComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterOutlet],
})
export class AppRoutingModule {}
