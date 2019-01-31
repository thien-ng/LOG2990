import { expect } from "chai";
import "reflect-metadata";
import { CircleDifferences } from "./circleDifferences.service";

describe("Tests on circleDifferences", () => {

    it("given an empty array, should return an empty array", (done: Function) => {
        let circleDifferences: CircleDifferences;
        const givenArray: number[] = [];

        const expectedArray: number[] = [];
        const width: number = 0;
        const radius: number = 1;

        circleDifferences = new CircleDifferences(givenArray, width, radius);
        const computedArray: number[] = circleDifferences.circleAllDifferences();
        expect(computedArray).deep.equal(expectedArray);
        done();
    });

    it("given an array with one 1, should return an array with one 1 ", (done: Function) => {
        let circleDifferences: CircleDifferences;
        const givenArray: number[] = [0];

        const expectedArray: number[] =   [0];
        const width: number = 1;
        const radius: number = 1;

        circleDifferences = new CircleDifferences(givenArray, width, radius);
        const computedArray: number[] = circleDifferences.circleAllDifferences();
        expect(computedArray).deep.equal(expectedArray);
        done();
    });

    it("given [0,1], should return a modified array", (done: Function) => {
        let circleDifferences: CircleDifferences;
        const givenArray: number[] = [0, 1];

        const expectedArray: number[] = [1, 1];
        const width: number = 2;
        const radius: number = 1;

        circleDifferences = new CircleDifferences(givenArray, width, radius);
        const computedArray: number[] = circleDifferences.circleAllDifferences();
        expect(computedArray).deep.equal(expectedArray);
        done();
    });

    it("given [0,1,0], should return a modified array", (done: Function) => {
        let circleDifferences: CircleDifferences;
        const givenArray: number[] = [0, 1, 0];

        const expectedArray: number[] = [1, 1, 1];
        const width: number = 3;
        const radius: number = 1;

        circleDifferences = new CircleDifferences(givenArray, width, radius);
        const computedArray: number[] = circleDifferences.circleAllDifferences();
        expect(computedArray).deep.equal(expectedArray);
        done();
    });

    // it("given [0,1,0], should return a modified array", (done: Function) => {
    //     let circleDifferences: CircleDifferences;
    //     const givenArray: number[] = [0, 1, 0,
    //                                   0, 0, 0];

    //     const expectedArray: number[] = [1, 1, 1,
    //                                      0, 1, 0];
    //     const width: number = 3;
    //     const radius: number = 1;

    //     circleDifferences = new CircleDifferences(givenArray, width, radius);
    //     const computedArray: number[] = circleDifferences.circleAllDifferences();
    //     expect(computedArray).deep.equal(expectedArray);
    //     done();
    // });
});
