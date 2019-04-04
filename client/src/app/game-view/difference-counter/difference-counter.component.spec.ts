import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { TestingImportsModule } from "../../testing-imports/testing-imports.module";

import { CClient } from "src/app/CClient";
import { DifferenceCounterComponent } from "./difference-counter.component";

describe("DifferenceCounterComponent", () => {
  let fixture:    ComponentFixture<DifferenceCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DifferenceCounterComponent ],
      imports:      [ TestingImportsModule ]})
    .compileComponents()
    .catch(() => CClient.OBLIGATORY_CATCH);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DifferenceCounterComponent);
    fixture.detectChanges();
  });
});
