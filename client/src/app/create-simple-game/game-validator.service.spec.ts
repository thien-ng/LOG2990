import { TestBed } from "@angular/core/testing";
// import { mock, when } from "ts-mockito";
import { FileValidatorService } from "./game-validator.service";

let fileValidatorService: FileValidatorService;

describe("FileValidatorService test", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: FileValidatorService = TestBed.get(FileValidatorService);
    expect(service).toBeTruthy();
  });

  it("should return true if blob type is accepted", () => {
    fileValidatorService = new FileValidatorService();
    let blob: Blob = {
      size: 0,
      type: "image/bmp",
      slice(start?: number, end?: number, contentType?: string): Blob{
        return new Blob();
      }
    };

    const result = fileValidatorService.validateFile(blob);
    expect(result).toBeTruthy();
  });

  it("should return false if blob type is not accepted", () => {
    fileValidatorService = new FileValidatorService();
    let blob: Blob = {
      size: 0,
      type: "image/dylan",
      slice(start?: number, end?: number, contentType?: string): Blob{
        return new Blob();
      }
    };

    const result = fileValidatorService.validateFile(blob);
    expect(result).toBeFalsy();
  });

});
