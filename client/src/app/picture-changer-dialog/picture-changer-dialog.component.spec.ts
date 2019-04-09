import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MatDialogRef } from "@angular/material";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { PictureChangerDialogComponent } from "./picture-changer-dialog.component";

// tslint:disable: no-floating-promises no-any

describe("PictureChangerDialogComponent", () => {
  let component: PictureChangerDialogComponent;
  let fixture: ComponentFixture<PictureChangerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:      [TestingImportsModule],
      declarations: [ PictureChangerDialogComponent ],
      providers:    [{ provide: MatDialogRef, useValue: {} }],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture   = TestBed.createComponent(PictureChangerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
