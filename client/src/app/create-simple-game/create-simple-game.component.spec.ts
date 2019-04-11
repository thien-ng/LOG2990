import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { CClient } from "../CClient";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { CreateSimpleGameComponent } from "./create-simple-game.component";

describe("CreateSimpleGameComponent", () => {
  let fixture:    ComponentFixture<CreateSimpleGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations:   [ CreateSimpleGameComponent ],
      imports:        [TestingImportsModule],
      providers:      [{
        provide:  MatDialogRef,
        useValue: {},
      },
                       {
        provide: MAT_DIALOG_DATA,
      }],
    })
    .compileComponents()
    .catch(() => CClient.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(CreateSimpleGameComponent);
    fixture.detectChanges();
  });
});
