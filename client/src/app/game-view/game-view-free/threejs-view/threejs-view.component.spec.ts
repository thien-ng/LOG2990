import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Constants } from "../../../constants";
import { TheejsViewComponent } from "./threejs-view.component";

describe("TheejsViewComponent", () => {
  let fixture: ComponentFixture<TheejsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheejsViewComponent ],
    })
    .compileComponents()
    .catch(() => Constants.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheejsViewComponent);
    fixture.detectChanges();
  });

});
