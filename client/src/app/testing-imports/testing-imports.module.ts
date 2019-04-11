import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatTabsModule,
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
    HttpClientModule,
    MatToolbarModule,
    HttpClientModule,
    MatButtonModule,
    MatGridListModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatCardModule,
    MatExpansionModule,
    MatSelectModule,
    RouterModule,
    RouterTestingModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDialogModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatInputModule,
    FormsModule,
    MatSliderModule,
    MatTabsModule,
    MatCheckboxModule,
  ],
})
export class TestingImportsModule { }
