import { TestBed } from "@angular/core/testing";

import { TimerService } from "./timer.service";

describe("TimerService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: TimerService = TestBed.get(TimerService);
    expect(service).toBeTruthy();
  });
});

describe("TimerService tests", () => {
  let timerService: TimerService;

  beforeEach(() => {
    timerService = new TimerService();
  });

  it("should not return the right time format given 1 second", () => {
    const seconds: number = 1;
    const expectedTimerFormat: string = "04:15";
    timerService.getTimer().subscribe((result: string) => {
      expect(result).not.toEqual(expectedTimerFormat);
    });
    timerService.timeFormat(seconds);
  });

  it("should return the right time format given 1 second", () => {
    const seconds: number = 1;
    const expectedTimerFormat: string = "00:01";
    timerService.getTimer().subscribe((result: string) => {
     expect(result).toEqual(expectedTimerFormat);
    });
    timerService.timeFormat(seconds);
  });

  it("should return the right time format given 10 seconds", () => {
    const seconds: number = 10;
    const expectedTimerFormat: string = "00:10";
    timerService.getTimer().subscribe((result: string) => {
     expect(result).toEqual(expectedTimerFormat);
    });
    timerService.timeFormat(seconds);
  });

  it("should return the right time format given 255 seconds", () => {
    const seconds: number = 255;
    const expectedTimerFormat: string = "04:15";
    timerService.getTimer().subscribe((result: string) => {
     expect(result).toEqual(expectedTimerFormat);
    });
    timerService.timeFormat(seconds);
  });

  it("should return the right time format given 600 seconds", () => {
    const seconds: number = 600;
    const expectedTimerFormat: string = "10:00";
    timerService.getTimer().subscribe((result: string) => {
     expect(result).toEqual(expectedTimerFormat);
    });
    timerService.timeFormat(seconds);
  });
});
