import "reflect-metadata";

import { expect } from "chai";
import * as fs from "fs";
import * as path from "path";
import { Message } from "../../../../common/communication/message";
import { DifferenceCheckerService } from "./difference-checker.service";

// tslint:disable:no-magic-numbers

let differenceCheckerService: DifferenceCheckerService;

describe("Differece checker service tests", () => {
    const testImageOg: Buffer = fs.readFileSync(path.resolve(__dirname, "../../asset/image/testBitmap/imagetestOg.bmp"));
    const testImageDiff: Buffer = fs.readFileSync(path.resolve(__dirname, "../../asset/image/testBitmap/imagetestDif.bmp"));

    beforeEach(() => {
        differenceCheckerService = new DifferenceCheckerService();
    });

    it("Should return the generated image buffer if requirements are satisfied", () => {
        const result: Message | Buffer = differenceCheckerService.generateDifferenceImage({
                                                                                requiredHeight: 480,
                                                                                requiredWidth: 640,
                                                                                requiredNbDiff: 7,
                                                                                originalImage: testImageOg,
                                                                                modifiedImage: testImageDiff,
                                                                        });
        expect(result).to.be.instanceof(Buffer);
    });
    it("Should return an error message if requirements are not satisfied", () => {
        const result: Message | Buffer = differenceCheckerService.generateDifferenceImage({
                                                                                requiredHeight: 480,
                                                                                requiredWidth: 640,
                                                                                requiredNbDiff: 7,
                                                                                originalImage: testImageOg,
                                                                                modifiedImage: testImageOg,
                                                                        });
        expect((result as Message).title).to.deep.equal("onError");
    });
});
