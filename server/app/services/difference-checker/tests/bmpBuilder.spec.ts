import { expect } from "chai";
import { BMPBuilder } from "../utilities/bmpBuilder";

// tslint:disable:no-magic-numbers

const WIDTH:        number = 2;
const HEIGHT:       number = 3;
const WHITE:        number = 255;
let builder:        BMPBuilder;
let bufferObtained: Buffer;

describe("BMPBuilder tests", () => {

    beforeEach(() => {
         builder = new BMPBuilder(WIDTH, HEIGHT, WHITE);
         builder.generateBuffer();
         bufferObtained = builder.buffer;
    });

    it("should return an object of type Buffer", (done: Function) => {
        // Chai's [type-detect](https://github.com/chaijs/type-detect)
        // module is currently classifying Node.js `buffer` objects
        // as the underlying `Uint8Array`
        expect(bufferObtained).to.be.an("uint8array");
        done();
    });

    it("should build a buffer of the correct width", (done: Function) => {
        const widthBuffer:          Buffer = bufferObtained.slice(18, 22);
        const expectedWidthBuffer:  Buffer = Buffer.from("02000000", "hex");

        expect(widthBuffer).to.deep.equal(expectedWidthBuffer);
        done();
    });

    it("should build a buffer of the correct height", (done: Function) => {
        const widthBuffer:          Buffer = bufferObtained.slice(22, 26);
        const expectedWidthBuffer:  Buffer = Buffer.from("03000000", "hex");

        expect(widthBuffer).to.deep.equal(expectedWidthBuffer);
        done();
    });

    it("should build a buffer of the right lenght", (done: Function) => {
        const totalBufferLenght:    number = bufferObtained.length;
        const headerSize:           number = 54;
        const pixelCount:           number = 2 * 3;
        const paddingTotal:         number = 6;
        const expectedBufferLenght: number = headerSize + pixelCount * 3 + paddingTotal;

        expect(totalBufferLenght).to.equal(expectedBufferLenght);
        done();
    });

    it("should return an error on negative width entered", (done: Function) => {
        expect(() => {
            builder = new BMPBuilder(-2, 3, 255);
            builder.generateBuffer();
        }).to.throw("Invalid width entered. Width must be a positive number higher than 0.");
        done();
    });

    it("should return an error on negative height entered", (done: Function) => {
        expect(() => {
            builder = new BMPBuilder(2, -3, 255);
            builder.generateBuffer();
        }).to.throw("Invalid height entered. Height must be a positive number higher than 0.");
        done();
    });

    it("should return an error on entry 0 for width", (done: Function) => {
        expect(() => {
            builder = new BMPBuilder(0, 3, 255);
            builder.generateBuffer();
        }).to.throw("Invalid width entered. Width must be a positive number higher than 0.");
        done();
    });

    it("should return an error on entry 0 for height", (done: Function) => {
        expect(() => {
            builder = new BMPBuilder(2, 0, 255);
            builder.generateBuffer();
        }).to.throw("Invalid height entered. Height must be a positive number higher than 0.");
        done();
    });

    it("should return a error on invalid entry for the filler number", (done: Function) => {
        expect(() => {
            builder = new BMPBuilder(2, 3, 256);
            builder.generateBuffer();
        }).to.throw("Invalid fill number entered. Must be comprised between 0 and 255 inclusively.");
        done();
    });

    it("should correctly change a pixel color", (done: Function) => {
        builder.setColorAtPos(5, 6, 7, 0, 0);
        bufferObtained = builder.buffer;
        const topLeftPixelIndex:                number = 16 + 54;
        const topLeftPixelColor:                Buffer = bufferObtained.slice(topLeftPixelIndex, topLeftPixelIndex + 3);
        const expectedtopLeftPixelColorBuffer:  Buffer = Buffer.from([7, 6, 5]);

        expect(topLeftPixelColor).to.deep.equal(expectedtopLeftPixelColorBuffer);
        done();
    });

    it("should return an error when trying to change a pixel out of bound", (done: Function) => {
        expect(() => {
            builder.setColorAtPos(5, 6, 7, 10, 20);
            builder.generateBuffer();
        }).to.throw("Entered position is out of bounds");
        done();
    });

    it("should create a buffer with the right amount of padding at each row", (done: Function) => {
        const HEADER_SIZE:          number = 54;
        const pixelSize:            number = 3;
        const paddingExpected:      number = 6;
        const totalLenghtExpected:  number = HEADER_SIZE + paddingExpected + WIDTH * HEIGHT * pixelSize;

        expect(bufferObtained.length).to.equal(totalLenghtExpected);
        done();
    });

    it("should create a buffer with the right amount of padding at each row", (done: Function) => {
        const width:                number = 3;
        const height:               number = 3;
        const HEADER_SIZE:          number = 54;
        const pixelSize:            number = 3;
        const paddingExpected:      number = 9;
        const totalLenghtExpected:  number = HEADER_SIZE + paddingExpected + width * height * pixelSize;

        builder = new BMPBuilder(width, height, WHITE);
        builder.generateBuffer();
        bufferObtained = builder.buffer;

        expect(bufferObtained.length).to.equal(totalLenghtExpected);
        done();
    });
});
