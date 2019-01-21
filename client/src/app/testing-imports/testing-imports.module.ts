import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
} from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

@NgModule({
  declarations: [],
  imports: [CommonModule],
  exports: [
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatCardModule,
    MatExpansionModule,
    RouterModule,
    RouterTestingModule,
    MatDialogModule,
    MatDividerModule,
    MatInputModule,
    MatFormFieldModule,
  ],
})
export class TestingImportsModule { }
