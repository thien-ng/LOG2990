import { expect } from "chai";
import { Constants } from "../utilities/constants";
import { DifferenceFinder } from "../utilities/differenceFinder";

// tslint:disable:no-magic-numbers

let differenceFinder: DifferenceFinder;

describe("Difference finder microservice tests", () => {

    beforeEach(() => {
        differenceFinder = new DifferenceFinder();
    });

    it("should be throw TypeError", (done: Function) => {

        const strBuff1: string = "ffffff";
        const strBuff2: string = "ffffffffffff";
        const buffer1: Buffer = Buffer.from(strBuff1, "hex");
        const buffer2: Buffer = Buffer.from(strBuff2, "hex");

        try {

            differenceFinder.searchDifferenceImage(buffer1, buffer2);

        } catch (error) {
            if (error instanceof TypeError) {
                expect(error.message).to.deep.equal(Constants.ERROR_UNEQUAL_DIMENSIONS);
            }
        }
        done();
    });

});
