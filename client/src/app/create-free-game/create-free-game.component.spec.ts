import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Constants } from "../constants";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { CreateFreeGameComponent } from "./create-free-game.component";

describe("CreateFreeGameComponent", () => {
  let component: CreateFreeGameComponent;
  let fixture: ComponentFixture<CreateFreeGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFreeGameComponent ],
      imports: [TestingImportsModule],
      providers: [{
        provide: MatDialogRef,
        useValue: {},
      },
                  {
        provide: MAT_DIALOG_DATA,
        useValue: {}, // Add any data you wish to test if it is passed/used correctly
      }],
    })
    .compileComponents()
    .catch(() => Constants.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFreeGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
