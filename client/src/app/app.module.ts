import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { MatButtonModule, MatFormFieldModule, MatInputModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";
import { BasicService } from "./basic.service";
import { LoginValidatorComponent } from "./login-validator/login-validator.component";
import { LoginViewComponent } from "./login-view/login-view.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginViewComponent,
    LoginValidatorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  providers: [BasicService],
  bootstrap: [AppComponent],
})
export class AppModule { }
