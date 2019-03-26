import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CClient } from "../../../CClient";
import { TheejsViewComponent } from "./threejs-view.component";

describe("TheejsViewComponent", () => {
  let fixture: ComponentFixture<TheejsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheejsViewComponent ],
    })
    .compileComponents()
    .catch(() => CClient.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheejsViewComponent);
    fixture.detectChanges();
  });
});
