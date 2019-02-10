import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatCardModule } from "@angular/material/card";

import { TimerComponent } from "./timer.component";

describe("TimerComponent", () => {
  let component: TimerComponent;
  let fixture: ComponentFixture<TimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimerComponent ],
      imports: [ MatCardModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

describe("TimerComponent tests", () => {
  let timer: TimerComponent;

  beforeEach(() => {
    timer = new TimerComponent();
  });

  it("should return the right time format given 2 seconds", () => {
    const min: number = 2;
    const timeFormat: string = "00:02";

    spyOn(timer, "startTimer").and.callFake(() => {
      timer.timeString = timer["convertSecondsToString"](min);
    });

    timer.startTimer();
    expect(timer.timeString).toEqual(timeFormat);
  });

  it("should return the right time format given 720 seconds", () => {
    const min: number = 720;
    const timeFormat: string = "12:00";

    spyOn(timer, "startTimer").and.callFake(() => {
      timer.timeString = timer["convertSecondsToString"](min);
    });

    timer.startTimer();
    expect(timer.timeString).toEqual(timeFormat);
  });

  it("should return the right time format given 72 seconds", () => {
    const min: number = 72;
    const timeFormat: string = "01:12";

    spyOn(timer, "startTimer").and.callFake(() => {
      timer.timeString = timer["convertSecondsToString"](min);
    });

    timer.startTimer();
    expect(timer.timeString).toEqual(timeFormat);
  });

  // it("should have called convertSecondsToString() ", () => {
  //   spyOn(timer, "startTimer").and.callThrough();

  //   timer.startTimer();
  //   expect(timer.timeString).not.toBeUndefined();
  // });
});
