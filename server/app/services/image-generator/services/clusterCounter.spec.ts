import { expect } from "chai";
import { ClusterCounter } from "./clusterCounter";

describe("Cluster Counter microservice tests", () => {

    it("should count all the distinct clusters in grid", (done: Function) => {
        const diffList: number[] = [ 0, 0, 1,
                                     1, 0, 0,
                                     0, 0, 1,
                                    ];
        const width: number = 3;

        const clusterCounter: ClusterCounter = new ClusterCounter(diffList, width);
        const count: number = clusterCounter.countAllClusters();
        const expectedAnswer: number = 3;
        expect(count).to.equal(expectedAnswer);
        done();
    });

    it("should count touching clusters (diagonal) as one", (done: Function) => {
        const diffList: number[] = [ 1, 0, 1, 1,
                                     1, 0, 0, 1,
                                     0, 0, 1, 1,
                                     1, 1, 0, 0,
                                    ];
        const WIDTH: number = 4;

        const clusterCounter: ClusterCounter = new ClusterCounter(diffList, WIDTH);
        const count: number = clusterCounter.countAllClusters();
        const expectedAnswer: number = 2;
        expect(count).to.equal(expectedAnswer);
        done();
    });
});
