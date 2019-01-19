import { LayoutModule } from "@angular/cdk/layout";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { AdminComponent } from "./admin/admin.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BasicService } from "./basic.service";
import { GameListComponent } from "./game-list/game-list.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { TestingImportsModule } from "./testing-imports/testing-imports.module";

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    LoginPageComponent,
    GameListComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LayoutModule,
    AppRoutingModule,
    RouterModule,
    TestingImportsModule,
  ],
  providers: [BasicService],
  bootstrap: [AppComponent],
})
export class AppModule { }
