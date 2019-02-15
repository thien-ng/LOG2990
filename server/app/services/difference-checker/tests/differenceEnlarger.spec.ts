import { expect } from "chai";
import "reflect-metadata";
import { BMPBuilder } from "../utilities/bmpBuilder";
import { DifferenceEnlarger } from "../utilities/differenceEnlarger";

// tslint:disable:no-magic-numbers max-func-body-length

const RADIUS:  number =   3;
const WHITE:   number = 255;
const BLACK:   number =   0;

let   builder: BMPBuilder;

describe("Difference Enlarger tests", () => {

    beforeEach(() => {
        builder = new BMPBuilder(2, 3, WHITE);
   });

    it("should return the same array when given an invalid number", (done: Function) => {

        builder.setColorAtPos(100, 100, 100, 1, 1);
        const bufferWithWrongColor: Buffer = builder.buffer;
        const expectedOutputBuffer: Buffer = Buffer.from(bufferWithWrongColor);

        const enlarger: DifferenceEnlarger = new DifferenceEnlarger(bufferWithWrongColor, 2, RADIUS);
        const bufferAfterEnlarger: Buffer = enlarger.enlargeAllDifferences();

        expect(bufferAfterEnlarger).deep.equal(expectedOutputBuffer);
        done();
    });

    it("should work when given a single pixel buffer (without difference)", (done: Function) => {
        const width:  number = 1;
        const height: number = 2;

        const newBuilder: BMPBuilder = new BMPBuilder(width, height, WHITE);
        const singlePixelBuffer: Buffer = Buffer.from(newBuilder.buffer);
        const expectedOutputBuffer: Buffer = Buffer.from(newBuilder.buffer);

        const enlarger:             DifferenceEnlarger = new DifferenceEnlarger(singlePixelBuffer, width, RADIUS);
        const bufferAfterEnlarger:  Buffer = enlarger.enlargeAllDifferences();

        expect(bufferAfterEnlarger).deep.equal(expectedOutputBuffer);
        done();
    });

    it("should work when given a single difference array (with difference)", (done: Function) => {
        const width:  number = 1;
        const height: number = 1;

        const singlePixelBuilder: BMPBuilder = new BMPBuilder(width, height, WHITE);
        singlePixelBuilder.setColorAtPos(BLACK, BLACK, BLACK, 0, 0);

        const singlePixelBuffer:    Buffer = singlePixelBuilder.buffer;
        const expectedOutputBuffer: Buffer = Buffer.from(singlePixelBuilder.buffer);

        const enlarger: DifferenceEnlarger = new DifferenceEnlarger(singlePixelBuffer, width, RADIUS);
        const bufferAfterEnlarger: Buffer = enlarger.enlargeAllDifferences();

        expect(bufferAfterEnlarger).to.deep.equal(expectedOutputBuffer);
        done();
    });

    it("should work when given an difference in a corner", (done: Function) => {
        const width:  number = 4;
        const height: number = 4;
        const inputBuilder: BMPBuilder = new BMPBuilder(width, height, WHITE);
        inputBuilder.setColorAtPos(BLACK, BLACK, BLACK, 3, 3);
        const diffInBottomCornerBuffer: Buffer = Buffer.from(inputBuilder.buffer);

        const expectedBuilder: BMPBuilder = new BMPBuilder(width, height, WHITE);
        const positions: number [][] = [
            [2, 0],
            [3, 0],
            [1, 1],
            [2, 1],
            [3, 1],
            [0, 2],
            [1, 2],
            [2, 2],
            [3, 2],
            [0, 3],
            [1, 3],
            [2, 3],
            [3, 3],
        ];
        const xIndex: number = 0;
        const yIndex: number = 1;
        positions.forEach((position: number[]) => {
            expectedBuilder.setColorAtPos(BLACK, BLACK, BLACK, position[xIndex], position[yIndex]);
        });

        const expectedOutputBuffer: Buffer = expectedBuilder.buffer;
        const enlarger: DifferenceEnlarger = new DifferenceEnlarger(diffInBottomCornerBuffer, width, RADIUS);
        const bufferAfterEnlarger: Buffer = enlarger.enlargeAllDifferences();
        expect(bufferAfterEnlarger).deep.equal(expectedOutputBuffer);
        done();
    });

    // it("should work when given an array with 1 in a corner", (done: Function) => {
    //     let circleDifferences: DifferenceEnlarger;
    //     const givenArray: number[] =   [0, 0, 0, 0,
    //                                     1, 0, 0, 0];

    //     const expectedArray: number[] = [1, 1, 1, 1,
    //                                      1, 1, 1, 1];
    //     const width: number = 4;
    //     const radius: number = 3;

    //     circleDifferences = new DifferenceEnlarger(givenArray, width, radius);
    //     const computedArray: number[] = circleDifferences.enlargeAllDifferences();
    //     expect(computedArray).deep.equal(expectedArray);
    //     done();
    // });

    // it("should work when given an array 2x5", (done: Function) => {
    //     let circleDifferences: DifferenceEnlarger;
    //     const givenArray: number[] =   [0, 0, 0, 0, 0,
    //                                     1, 0, 0, 0, 0];

    //     const expectedArray: number[] = [1, 1, 1, 1, 0,
    //                                      1, 1, 1, 1, 0];
    //     const width: number = 5;
    //     const radius: number = 3;

    //     circleDifferences = new DifferenceEnlarger(givenArray, width, radius);
    //     const computedArray: number[] = circleDifferences.enlargeAllDifferences();
    //     expect(computedArray).deep.equal(expectedArray);
    //     done();
    // });

    // it("should work when given an array 5x5", (done: Function) => {
    //     let circleDifferences: DifferenceEnlarger;
    //     const givenArray: number[] =   [0, 0, 0, 0, 0,
    //                                     0, 0, 0, 0, 0,
    //                                     0, 0, 1, 0, 0,
    //                                     0, 0, 0, 0, 0,
    //                                     0, 0, 0, 0, 0];

    //     const expectedArray: number[] = [1, 1, 1, 1, 1,
    //                                      1, 1, 1, 1, 1,
    //                                      1, 1, 1, 1, 1,
    //                                      1, 1, 1, 1, 1,
    //                                      1, 1, 1, 1, 1];
    //     const width: number = 5;
    //     const radius: number = 3;

    //     circleDifferences = new DifferenceEnlarger(givenArray, width, radius);
    //     const computedArray: number[] = circleDifferences.enlargeAllDifferences();
    //     expect(computedArray).deep.equal(expectedArray);
    //     done();
    // });

    // it("should work when given an array 5x5 with 1 in the corner", (done: Function) => {
    //     let circleDifferences: DifferenceEnlarger;
    //     const givenArray: number[] =   [0, 0, 0, 0, 1,
    //                                     0, 0, 0, 0, 0,
    //                                     0, 0, 0, 0, 0,
    //                                     0, 0, 0, 0, 0,
    //                                     0, 0, 0, 0, 0];

    //     const expectedArray: number[] =    [0, 1, 1, 1, 1,
    //                                         0, 1, 1, 1, 1,
    //                                         0, 0, 1, 1, 1,
    //                                         0, 0, 0, 1, 1,
    //                                         0, 0, 0, 0, 0];
    //     const width: number = 5;
    //     const radius: number = 3;

    //     circleDifferences = new DifferenceEnlarger(givenArray, width, radius);
    //     const computedArray: number[] = circleDifferences.enlargeAllDifferences();
    //     expect(computedArray).deep.equal(expectedArray);
    //     done();
    // });
});
