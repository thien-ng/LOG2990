import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CClient } from "src/app/CClient";
import { TestingImportsModule } from "src/app/testing-imports/testing-imports.module";
import { Dialog } from "../../../../../common/communication/iCard";
import { ConfirmationDialogComponent } from "./confirmation-dialog.component";

describe("ConfirmationDialogComponent", () => {
  let fixture:    ComponentFixture<ConfirmationDialogComponent>;

  const model: Dialog = {
    message: "",
    gameTitle: ""};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmationDialogComponent ],
      imports: [ TestingImportsModule ],
      providers:      [{
        provide:  MatDialogRef,
      },
                       {
        provide: MAT_DIALOG_DATA,
        useValue: model,
      }],
    })
    .compileComponents().catch(() => CClient.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(ConfirmationDialogComponent);
    fixture.detectChanges();
  });
});
