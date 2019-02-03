import { TestBed } from "@angular/core/testing";
import { FileValidatorService } from "./game-validator.service";

// tslint:disable:no-any no-floating-promises

describe("FileValidatorService test", () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  const fileValidatorService: FileValidatorService = new FileValidatorService();

  it("should be created", () => {
    const service: FileValidatorService = TestBed.get(FileValidatorService);
    expect(service).toBeTruthy();
  });
  it("Should return false if the type is not correct (PNG)", () => {
    const blob: Blob = new Blob([], {type: "image/png"});
    expect(fileValidatorService.validateFile(blob)).toBe(false);
  });
  it("Should return false if the type is not correct (JPG)", () => {
    const blob: Blob = new Blob([], {type: "image/jpg"});
    expect(fileValidatorService.validateFile(blob)).toBe(false);
  });
  it("Should return true if the type is correct (BMP)", () => {
    const blob: Blob = new Blob([], {type: "image/bmp"});
    expect(fileValidatorService.validateFile(blob)).toBe(true);
  });
});
