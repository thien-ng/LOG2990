import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Constants } from "../constants";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { CreateSimpleGameComponent } from "./create-simple-game.component";

describe("CreateSimpleGameComponent", () => {
  let component:  CreateSimpleGameComponent;
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
    .catch(() => Constants.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(CreateSimpleGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
