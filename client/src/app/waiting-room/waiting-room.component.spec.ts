import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Constants } from "../constants";
import { TestingImportsModule } from "../testing-imports/testing-imports.module";
import { WaitingRoomComponent } from "./waiting-room.component";

describe("WaitingRoomComponent", () => {
  let component: WaitingRoomComponent;
  let fixture: ComponentFixture<WaitingRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingRoomComponent ],
      imports:      [ TestingImportsModule ],
    })
    .compileComponents()
    .catch(() => Constants.OBLIGATORY_CATCH);
  }));

});
