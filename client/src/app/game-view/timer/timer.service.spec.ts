import { TestBed } from "@angular/core/testing";

import { TimerService } from "./timer.service";

describe("TimerService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: TimerService = TestBed.get(TimerService);
    expect(service).toBeTruthy();
  });
});

// describe("TimerComponent tests", () => {
//   let timer: TimerComponent;

//   beforeEach(() => {
//     timer = new TimerComponent();
//   });

//   it("should return the right time format given 2 seconds", () => {
//     const min: number = 2;
//     const timeFormat: string = "00:02";

//     spyOn(timer, "startTimer").and.callFake(() => {
//       timer.timeString = timer["convertSecondsToString"](min);
//     });

//     timer.startTimer();
//     expect(timer.timeString).toEqual(timeFormat);
//   });

//   it("should return the right time format given 720 seconds", () => {
//     const min: number = 720;
//     const timeFormat: string = "12:00";

//     spyOn(timer, "startTimer").and.callFake(() => {
//       timer.timeString = timer["convertSecondsToString"](min);
//     });

//     timer.startTimer();
//     expect(timer.timeString).toEqual(timeFormat);
//   });

//   it("should return the right time format given 72 seconds", () => {
//     const min: number = 72;
//     const timeFormat: string = "01:12";

//     spyOn(timer, "startTimer").and.callFake(() => {
//       timer.timeString = timer["convertSecondsToString"](min);
//     });

//     timer.startTimer();
//     expect(timer.timeString).toEqual(timeFormat);
//   });
// });
