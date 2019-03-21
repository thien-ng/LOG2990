import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Constants } from "src/app/constants";
import { TestingImportsModule } from "src/app/testing-imports/testing-imports.module";
import { Dialog } from "../../../../../common/communication/iCard";
import { ConfirmationDialogComponent } from "./confirmation-dialog.component";

describe("ConfirmationDialogComponent", () => {
  let component:  ConfirmationDialogComponent;
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
    .compileComponents().catch(() => Constants.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
