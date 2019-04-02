import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { TestingImportsModule } from "src/app/testing-imports/testing-imports.module";
import { EndGameDialogService } from "../end-game-dialog.service";
import { EndGameDialogComponent } from "./end-game-dialog.component";

// tslint:disable: no-floating-promises

describe("EndGameDialogComponent", () => {
  let component: EndGameDialogComponent;
  let fixture: ComponentFixture<EndGameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndGameDialogComponent ],
      imports:      [TestingImportsModule],
      providers:    [
        EndGameDialogService,
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} } ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
