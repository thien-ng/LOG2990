import { expect } from "chai";
import { BMPBuilder } from "../utilities/bmpBuilder";
import { Constants } from "../utilities/constants";
import { DifferenceFinder } from "../utilities/differenceFinder";

// tslint:disable:no-magic-numbers

let differenceFinder: DifferenceFinder;

describe("Difference finder microservice tests", () => {

    beforeEach(() => {
        differenceFinder = new DifferenceFinder();
    });

    it("should be throw TypeError if images have unequal dimensions", (done: Function) => {

        const strBuff1: string = "ffffff";
        const strBuff2: string = "ffffffffffff";
        const buffer1:  Buffer = Buffer.from(strBuff1, "hex");
        const buffer2:  Buffer = Buffer.from(strBuff2, "hex");

        try {

            differenceFinder.searchDifferenceImage(buffer1, buffer2);

        } catch (error) {
            if (error instanceof TypeError) {
                expect(error.message).to.deep.equal(Constants.ERROR_UNEQUAL_DIMENSIONS);
            }
        }
        done();
    });

    it("should return a buffer containing the different pixels in black", (done: Function) => {

        const width:  number =   3;
        const height: number =   3;
        const WHITE:  number = 255;
        const BLACK:  number =   0;

        const bmpBuilder1:      BMPBuilder = new BMPBuilder(width, height, WHITE);
        const bmpBuilder2:      BMPBuilder = new BMPBuilder(width, height, WHITE);
        const expectedBuilder:  BMPBuilder = new BMPBuilder(width, height, WHITE);

        bmpBuilder1.generateBuffer();
        bmpBuilder2.generateBuffer();
        expectedBuilder.generateBuffer();

        bmpBuilder1.setColorAtPos(1, 1, 1, 0, 0);
        expectedBuilder.setColorAtPos(BLACK, BLACK, BLACK, 0, 0);

        const buffer1:        Buffer = bmpBuilder1.buffer;
        const buffer2:        Buffer = bmpBuilder2.buffer;
        const expectedBuffer: Buffer = expectedBuilder.buffer;
        const outputBuffer:   Buffer = differenceFinder.searchDifferenceImage(buffer1, buffer2);

        expect(outputBuffer).to.deep.equal(expectedBuffer);
        done();
    });
});
