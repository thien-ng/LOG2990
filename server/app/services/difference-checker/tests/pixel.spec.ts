import { expect } from "chai";
import { Pixel } from "../../difference-checker/utilitaries/pixel";

// tslint:disable:no-magic-numbers no-any

let pixel: Pixel;

beforeEach(() => {
    pixel = new Pixel(1, 2, 3);
});

describe("Pixel tests", () => {

    it ("should return 1 if get red", (done: Function) => {
        const result: number = pixel.getRed();
        expect(result).to.equal(1);
        done();
    });

    it ("should return 2 if get green", (done: Function) => {
        const result: number = pixel.getGreen();
        expect(result).to.equal(2);
        done();
    });

    it ("should return 3 if get blue", (done: Function) => {
        const result: number = pixel.getBlue();
        expect(result).to.equal(3);
        done();
    });

    it ("should return true if pixels are equal", (done: Function) => {
        const testPixel: Pixel = new Pixel(1, 2, 3);
        const result: Boolean = pixel.isEqual(testPixel);
        expect(result).to.equal(true);
        done();
    });

    it ("should return false if pixels are not equal", (done: Function) => {
        const testPixel: Pixel = new Pixel(4, 3, 2);
        const result: Boolean = pixel.isEqual(testPixel);
        expect(result).to.equal(false);
        done();
    });

});
