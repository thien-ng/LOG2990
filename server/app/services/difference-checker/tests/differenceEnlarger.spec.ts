// import { expect } from "chai";
import "reflect-metadata";
// import { DifferenceEnlarger } from "../utilities/differenceEnlarger";

// tslint:disable:no-magic-numbers

describe("CircleDifferences tests", () => {

    // it("should return an empty array when given an empty array", (done: Function) => {
    //     let circleDifferences: DifferenceEnlarger;
    //     const givenArray: number[] = [];

    //     const expectedArray: number[] = [];
    //     const width: number = 0;
    //     const radius: number = 1;

    //     circleDifferences = new DifferenceEnlarger(givenArray, width, radius);
    //     const computedArray: number[] = circleDifferences.enlargeAllDifferences();
    //     expect(computedArray).deep.equal(expectedArray);
    //     done();
    // });

    // it("should return the same array when given an not valid number", (done: Function) => {
    //     let circleDifferences: DifferenceEnlarger;
    //     const givenArray: number[] = [2];

    //     const expectedArray: number[] = [2];
    //     const width: number = 1;
    //     const radius: number = 3;

    //     circleDifferences = new DifferenceEnlarger(givenArray, width, radius);
    //     const computedArray: number[] = circleDifferences.enlargeAllDifferences();
    //     expect(computedArray).deep.equal(expectedArray);
    //     done();
    // });

    // it("should work when given a single difference array (without difference)", (done: Function) => {
    //     let circleDifferences: DifferenceEnlarger;
    //     const givenArray: number[] = [0];

    //     const expectedArray: number[] =   [0];
    //     const width: number = 1;
    //     const radius: number = 3;

    //     circleDifferences = new DifferenceEnlarger(givenArray, width, radius);
    //     const computedArray: number[] = circleDifferences.enlargeAllDifferences();
    //     expect(computedArray).deep.equal(expectedArray);
    //     done();
    // });

    // it("should work when given a single difference array (with difference)", (done: Function) => {
    //     let circleDifferences: DifferenceEnlarger;
    //     const givenArray: number[] = [1];

    //     const expectedArray: number[] =   [1];
    //     const width: number = 1;
    //     const radius: number = 3;

    //     circleDifferences = new DifferenceEnlarger(givenArray, width, radius);
    //     const computedArray: number[] = circleDifferences.enlargeAllDifferences();
    //     expect(computedArray).deep.equal(expectedArray);
    //     done();
    // });

    // it("should work when given an array 1x2 with 1 difference", (done: Function) => {
    //     let circleDifferences: DifferenceEnlarger;
    //     const givenArray: number[] = [0,
    //                                   1];

    //     const expectedArray: number[] = [1,
    //                                      1];
    //     const width: number = 1;
    //     const radius: number = 3;

    //     circleDifferences = new DifferenceEnlarger(givenArray, width, radius);
    //     const computedArray: number[] = circleDifferences.enlargeAllDifferences();
    //     expect(computedArray).deep.equal(expectedArray);
    //     done();
    // });

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

    // it("should work when given an array with missing value", (done: Function) => {
    //     let circleDifferences: DifferenceEnlarger;
    //     const givenArray: number[] =   [0, 0, 0, 0, 0,
    //                                     1, 0, 0];

    //     const expectedArray: number[] = [1, 1, 1, 1, 0,
    //                                      1, 1, 1];
    //     const width: number = 5;
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
