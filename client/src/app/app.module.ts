import { LayoutModule } from "@angular/cdk/layout";
import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";

import { MatButtonModule, MatCardModule, MatExpansionModule, MatMenuModule } from "@angular/material";
import { AdminComponent } from "./admin/admin.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BasicService } from "./basic.service";
import { CardComponent } from "./card/card.component";
import { GameListComponent } from "./game-list/game-list.component";
import { HighscoreDisplayComponent } from "./highscore-display/highscore-display.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { MainNavComponent } from "./main-nav/main-nav.component";
import { TestingImportsModule } from "./testing-imports/testing-imports.module";

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
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatExpansionModule,
  ],
  exports: [
    LayoutModule,
    AppRoutingModule,
    RouterModule,
    TestingImportsModule,
  ],
  providers: [BasicService],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
