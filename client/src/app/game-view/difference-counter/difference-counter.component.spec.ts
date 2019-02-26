import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TestingImportsModule } from "../../testing-imports/testing-imports.module";

import { Constants } from "src/app/constants";
import { DifferenceCounterComponent } from "./difference-counter.component";

describe("DifferenceCounterComponent", () => {
  let component:  DifferenceCounterComponent;
  let fixture:    ComponentFixture<DifferenceCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DifferenceCounterComponent ],
      imports:      [ TestingImportsModule ]})
    .compileComponents()
    .catch(() => Constants.OBLIGATORY_CATCH);
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
