import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MatButtonModule, MatCardModule, MatExpansionModule, MatMenuModule } from "@angular/material";
import { AppComponent } from "./app.component";
import { BasicService } from "./basic.service";
import { CardComponent } from "./card/card.component";
import { HighscoreDisplayComponent } from "./highscore-display/highscore-display.component";

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    HighscoreDisplayComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatButtonModule,
    MatCardModule,
    MatMenuModule,
    MatExpansionModule,
  ],
  exports: [
  ],
  providers: [BasicService],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule { }
