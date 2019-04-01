import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EndGameDialogComponent } from "./end-game-dialog.component";

// tslint:disable: no-floating-promises

describe("EndGameDialogComponent", () => {
  let component: EndGameDialogComponent;
  let fixture: ComponentFixture<EndGameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndGameDialogComponent ],
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
