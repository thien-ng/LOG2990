import { TestBed } from "@angular/core/testing";

import { DifferenceCounterService } from "./difference-counter.service";

describe("DifferenceCounterService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: DifferenceCounterService = TestBed.get(DifferenceCounterService);
    expect(service).toBeTruthy();
  });
});

describe("DifferenceCounterService tests", () => {
  let differenceCounterService: DifferenceCounterService;
  const maxError: number = 7;

  beforeEach(() => {
    differenceCounterService = new DifferenceCounterService();
  });

  it("should return the right percentage given 2 errors", () => {
    const errorFound:     number = 4;
    const expectedAnswer: number = 58;
    let answer:           number = 0;

    differenceCounterService.setNbErrorMax(maxError);
    answer = differenceCounterService.convertErrorToPercent(errorFound);

    expect(answer).toBeLessThan(expectedAnswer);
  });

  it("should return the right percentage given 7 errors", () => {
    const errorFound:     number = 7;
    const expectedAnswer: number = 100;
    let answer:           number = 0;

    differenceCounterService.setNbErrorMax(maxError);
    answer = differenceCounterService.convertErrorToPercent(errorFound);

    expect(answer).toBeLessThanOrEqual(expectedAnswer);
  });

  it("should return maxError equal to given number to setNbErrorMax", () => {
    differenceCounterService.setNbErrorMax(maxError);

    expect(differenceCounterService["maxError"]).toEqual(maxError);
  });

  it("should return the right angle when given 2 errors", () => {
    const errorFound:     number = 2;
    const expectedAngle:  number = 103;
    let angle:            number = 0;

    differenceCounterService.setNbErrorMax(maxError);
    angle = differenceCounterService.generateAngleSpinner(errorFound);

    expect(angle).toBeLessThan(expectedAngle);
  });

  it("should return the right angle when given 6 errors", () => {
    const errorFound:     number = 6;
    const expectedAngle:  number = 309;
    let angle:            number = 0;

    differenceCounterService.setNbErrorMax(maxError);
    angle = differenceCounterService.generateAngleSpinner(errorFound);

    expect(angle).toBeLessThan(expectedAngle);
  });
});
