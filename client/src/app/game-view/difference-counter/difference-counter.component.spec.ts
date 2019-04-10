import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CClient } from "src/app/CClient";
import { DifferenceCounterComponent } from "./difference-counter.component";

describe("DifferenceCounterComponent", () => {
  let component:  DifferenceCounterComponent;
  let fixture:    ComponentFixture<DifferenceCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DifferenceCounterComponent],
    })
    .compileComponents()
    .catch(() => CClient.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DifferenceCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
