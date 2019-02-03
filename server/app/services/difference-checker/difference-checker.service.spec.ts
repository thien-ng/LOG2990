import "reflect-metadata";

import { expect } from "chai";
import * as fs from "fs";
import * as path from "path";
import { Message } from "../../../../common/communication/message";
import { DifferenceCheckerService } from "./difference-checker.service";
import { ImageRequirements } from "./utilities/imageRequirements";

// tslint:disable:no-magic-numbers

let differenceCheckerService: DifferenceCheckerService;

describe("Differece checker service tests", () => {
    const testImageOg: Buffer = fs.readFileSync(path.resolve(__dirname, "../../asset/image/testBitmap/imagetestOg.bmp"));
    const testImageDiff: Buffer = fs.readFileSync(path.resolve(__dirname, "../../asset/image/testBitmap/imagetestDif.bmp"));

    console.log(testImageOg);
    console.log(testImageDiff);

    const requirements: ImageRequirements = {
        requiredHeight: 480,
        requiredWidth: 640,
        requiredNbDiff: 7,
        originalImage: testImageOg,
        modifiedImage: testImageDiff,
};

    beforeEach(() => {
        differenceCheckerService = new DifferenceCheckerService();
    });

    it("Should", () => {
        const result: Message | Buffer = differenceCheckerService.generateDifferenceImage(requirements);
        expect(result).instanceOf(Buffer);
    });
});
