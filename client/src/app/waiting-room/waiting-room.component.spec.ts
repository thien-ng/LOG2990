import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Constants } from "../constants";
import { SpinnerComponent } from "../spinner/spinner.component";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { WaitingRoomComponent } from "./waiting-room.component";

describe("WaitingRoomComponent", () => {
  let component: WaitingRoomComponent;
  let fixture: ComponentFixture<WaitingRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:      [ TestingImportsModule ],
      declarations: [
        WaitingRoomComponent,
        SpinnerComponent,
      ],
    })
    .compileComponents()
    .catch(() => Constants.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingRoomComponent);
    component = fixture.componentInstance;
    component["gameID"] = "1";
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
