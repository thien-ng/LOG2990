import { expect } from "chai";
import { BMPBuilder } from "../utilities/bmpBuilder";
import { ClusterCounter } from "../utilities/clusterCounter";

// tslint:disable:no-magic-numbers
const WHITE:    number = 255;
const BLACK:    number =   0;

describe("Cluster Counter tests", () => {

    it("should count one clusters in a grid", (done: Function) => {
        const width:    number = 4;
        const height:   number = 4;

        const newBuilder: BMPBuilder = new BMPBuilder(width, height, WHITE);
        newBuilder.setColorAtPos(BLACK, BLACK, BLACK, 2, 2);

        const bufferWIthDiff: Buffer = Buffer.from(newBuilder.buffer);

        const clusterCounter: ClusterCounter = new ClusterCounter(bufferWIthDiff, width);
        const numberOfDiffFound: number = clusterCounter.countAllClusters();

        expect(numberOfDiffFound).equal(1);
        done();
    });

    it("should count all the distinct clusters in grid", (done: Function) => {
        const width:    number = 4;
        const height:   number = 4;

        const newBuilder: BMPBuilder = new BMPBuilder(width, height, WHITE);
        newBuilder.setColorAtPos(BLACK, BLACK, BLACK, 0, 3);
        newBuilder.setColorAtPos(BLACK, BLACK, BLACK, 3, 0);

        const bufferWIthDiff: Buffer = Buffer.from(newBuilder.buffer);

        const clusterCounter: ClusterCounter = new ClusterCounter(bufferWIthDiff, width);
        const numberOfDiffFound: number = clusterCounter.countAllClusters();

        expect(numberOfDiffFound).equal(2);
        done();
    });

    it("should count all the distinct clusters in grid", (done: Function) => {
        const width:    number = 4;
        const height:   number = 4;

        const newBuilder: BMPBuilder = new BMPBuilder(width, height, WHITE);
        newBuilder.setColorAtPos(BLACK, BLACK, BLACK, 0, 3);
        newBuilder.setColorAtPos(BLACK, BLACK, BLACK, 0, 2);

        const bufferWIthDiff: Buffer = Buffer.from(newBuilder.buffer);

        const clusterCounter: ClusterCounter = new ClusterCounter(bufferWIthDiff, width);
        const numberOfDiffFound: number = clusterCounter.countAllClusters();

        expect(numberOfDiffFound).equal(1);
        done();
    });

    it("should count touching clusters (diagonal) as one", (done: Function) => {
        const width:    number = 4;
        const height:   number = 4;

        const newBuilder: BMPBuilder = new BMPBuilder(width, height, WHITE);
        newBuilder.setColorAtPos(BLACK, BLACK, BLACK, 0, 0);
        newBuilder.setColorAtPos(BLACK, BLACK, BLACK, 1, 1);

        const bufferWIthDiff: Buffer = Buffer.from(newBuilder.buffer);

        const clusterCounter: ClusterCounter = new ClusterCounter(bufferWIthDiff, width);
        const numberOfDiffFound: number = clusterCounter.countAllClusters();

        expect(numberOfDiffFound).equal(1);
        done();
    });

    // it("should count clusters in a horizontal array", (done: Function) => {
    //     const diffList: number[] = [ 1, 0, 1, 1, 0, 0, 0, 1,
    //                                  1, 0, 0, 1, 1, 0, 0, 1,
    //                                  0, 0, 1, 1, 0, 0, 1, 0,
    //                                  1, 1, 0, 0, 0, 0, 0, 1,
    //                                 ];
    //     const WIDTH: number = 8;

    //     const clusterCounter: ClusterCounter = new ClusterCounter(diffList, WIDTH);
    //     const count: number = clusterCounter.countAllClusters();
    //     const expectedAnswer: number = 3;
    //     expect(count).to.equal(expectedAnswer);
    //     done();
    // });

    // it("should count clusters in a vertical array", (done: Function) => {
    //     const diffList: number[] = [ 0, 0, 1, 1,
    //                                  0, 0, 0, 1,
    //                                  0, 0, 0, 1,
    //                                  0, 0, 0, 1,
    //                                  0, 0, 0, 1,
    //                                  0, 0, 1, 0,
    //                                  0, 0, 0, 0,
    //                                  1, 0, 0, 1,
    //                                 ];
    //     const WIDTH: number = 4;

    //     const clusterCounter: ClusterCounter = new ClusterCounter(diffList, WIDTH);
    //     const count: number = clusterCounter.countAllClusters();
    //     const expectedAnswer: number = 3;
    //     expect(count).to.equal(expectedAnswer);
    //     done();
    // });

    it("should count clusters in an single cell array with a difference", (done: Function) => {
        const width:    number = 1;
        const height:   number = 1;

        const newBuilder: BMPBuilder = new BMPBuilder(width, height, WHITE);
        newBuilder.setColorAtPos(BLACK, BLACK, BLACK, 0, 0);

        const bufferWIthDiff: Buffer = Buffer.from(newBuilder.buffer);

        const clusterCounter: ClusterCounter = new ClusterCounter(bufferWIthDiff, width);
        const numberOfDiffFound: number = clusterCounter.countAllClusters();

        expect(numberOfDiffFound).equal(1);
        done();
    });

    // it("should count clusters in an single cell array without a difference", (done: Function) => {
    //     const diffList: number[] = [ 0 ];
    //     const WIDTH: number = 1;

    //     const clusterCounter: ClusterCounter = new ClusterCounter(diffList, WIDTH);
    //     const count: number = clusterCounter.countAllClusters();
    //     const expectedAnswer: number = 0;
    //     expect(count).to.equal(expectedAnswer);
    //     done();
    // });

    // it("should count no clusters in an empty given array", (done: Function) => {
    //     const diffList: number[] = [ ];
    //     const WIDTH: number = 0;

    //     const clusterCounter: ClusterCounter = new ClusterCounter(diffList, WIDTH);
    //     const count: number = clusterCounter.countAllClusters();
    //     const expectedAnswer: number = 0;
    //     expect(count).to.equal(expectedAnswer);
    //     done();
    // });

    // it("should handle a given width bigger than the given array length ", (done: Function) => {
    //     const diffList: number[] = [ 0, 0,
    //                                  1, 0,
    //                                 ];
    //     const WIDTH: number = 10;

    //     const clusterCounter: ClusterCounter = new ClusterCounter(diffList, WIDTH);
    //     const count: number = clusterCounter.countAllClusters();
    //     const expectedAnswer: number = 1;
    //     expect(count).to.equal(expectedAnswer);
    //     done();
    // });

    // it("should handle a given array with errors in data (something else than 0's and 1's", (done: Function) => {
    //     const diffList: number[] = [ 0, 0, 6,
    //                                  1, 0, 0,
    //                                  0, 0, 0,
    //                                 ];
    //     const WIDTH: number = 3;

    //     const clusterCounter: ClusterCounter = new ClusterCounter(diffList, WIDTH);
    //     const count: number = clusterCounter.countAllClusters();
    //     const expectedAnswer: number = 1;
    //     expect(count).to.equal(expectedAnswer);
    //     done();
    // });
});
