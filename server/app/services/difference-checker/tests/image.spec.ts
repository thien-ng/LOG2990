import { expect } from "chai";
import { Image } from "../../difference-checker/utilitaries/image";
import { Pixel } from "../../difference-checker/utilitaries/pixel";

// tslint:disable:no-magic-numbers no-any

let image: Image;

beforeEach(() => {
    const firstTestPixel: Pixel = new Pixel(255, 255, 255);
    const secondTestPixel: Pixel = new Pixel(0, 0, 0);
    const listPixel: Pixel[] = [];
    listPixel.push(firstTestPixel, secondTestPixel);
    image = new Image(480, 640, listPixel);
});

describe("Pixel test", () => {

    it ("should return 640 if get Width", (done: Function) => {
        const result: number = image.getWidth();
        expect(result).to.equal(640);
        done();
    });

    it ("should return 480 if get height", (done: Function) => {
        const result: number = image.getHeight();
        expect(result).to.equal(480);
        done();
    });

    it ("should return list with 2 pixel if get pixelList", (done: Function) => {
        const result: Pixel[] = image.getPixels();
        const firstTestPixel: Pixel = new Pixel(255, 255, 255);
        const secondTestPixel: Pixel = new Pixel(0, 0, 0);
        const listPixel: Pixel[] = [];

        listPixel.push(firstTestPixel, secondTestPixel);
        expect(result.length).to.equal(2);
        done();
    });

});
