import { expect } from "chai";
import { Constants } from "../../../constants";
import { ImagesDifference } from "../utilities/imagesDifference";

// tslint:disable:no-magic-numbers

let imagesDifference: ImagesDifference;

describe("Images Difference finder microservice tests", () => {

    beforeEach(() => {
        imagesDifference = new ImagesDifference();
    });

    it("should be throw TypeError", (done: Function) => {

        const strBuff1: string = "ffffff";
        const strBuff2: string = "ffffffffffff";
        const buffer1: Buffer = Buffer.from(strBuff1, "hex");
        const buffer2: Buffer = Buffer.from(strBuff2, "hex");

        try {

            imagesDifference.searchDifferenceImage(buffer1, buffer2);

        } catch (error) {
            if (error instanceof TypeError) {
                expect(error.message).to.deep.equal(Constants.ERROR_UNEQUAL_DIMENSIONS);
            }
        }
        done();
    });

});
