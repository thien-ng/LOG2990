import { expect } from "chai";
import { ImagesDifference } from "../utilitaries/imagesDifference";

// tslint:disable:no-magic-numbers

let imagesDifference: ImagesDifference;

describe("Images Difference finder microservice tests", () => {

    beforeEach(() => {
        imagesDifference = new ImagesDifference();
    });

    it("test", (done: Function) => {

        const strBuff1: string = "ffffff";
        const strBuff2: string = "000000";
        const buffer1: Buffer = Buffer.from(strBuff1, "hex");
        const buffer2: Buffer = Buffer.from(strBuff2, "hex");

        const result: number[] = imagesDifference.searchDifferenceImage(buffer1, buffer2);

        expect(result).to.deep.equal([1]);

        done();
    });

    it("test", (done: Function) => {

        const strBuff1: string = "ffffff";
        const strBuff2: string = "ffffff";
        const buffer1: Buffer = Buffer.from(strBuff1, "hex");
        const buffer2: Buffer = Buffer.from(strBuff2, "hex");

        const result: number[] = imagesDifference.searchDifferenceImage(buffer1, buffer2);

        expect(result).to.deep.equal([0]);

        done();
    });

    it("test", (done: Function) => {

        const strBuff1: string = "ffffff000000ffffff";
        const strBuff2: string = "ffffffffffffffffff";
        const buffer1: Buffer = Buffer.from(strBuff1, "hex");
        const buffer2: Buffer = Buffer.from(strBuff2, "hex");

        const result: number[] = imagesDifference.searchDifferenceImage(buffer1, buffer2);

        expect(result).to.deep.equal([0, 1, 0]);

        done();
    });

    it("test", (done: Function) => {

        const strBuff1: string = "ffffff";
        const strBuff2: string = "ffffffffffff";
        const buffer1: Buffer = Buffer.from(strBuff1, "hex");
        const buffer2: Buffer = Buffer.from(strBuff2, "hex");

        try {

            imagesDifference.searchDifferenceImage(buffer1, buffer2);

        } catch (error) {
            if (error instanceof TypeError) {
                expect(error.message).to.deep.equal("size of buffers are not equal");
            }
        }
        done();
    });

});
