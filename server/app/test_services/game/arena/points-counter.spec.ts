import { expect } from "chai";
import "reflect-metadata";
import { PointsCounter } from "../../../services/game/arena/points-counter";

// tslint:disable:no-magic-numbers

let pointsCounter: PointsCounter;

beforeEach(() => {
    pointsCounter = new PointsCounter(7);
});

describe("PointsCounter tests", () => {

    it("should return 0 when get player one counter", () => {
        const result: number = pointsCounter.getPlayerOneCounter();
        expect(result).to.equal(0);
    });

    it("should return 0 when get player two counter", () => {
        const result: number = pointsCounter.getPlayerTwoCounter();
        expect(result).to.equal(0);
    });

    it("should return 1 when get player one counter", () => {
        pointsCounter.incrementPlayerOneCounter();
        const result: number = pointsCounter.getPlayerOneCounter();
        expect(result).to.equal(1);
    });

    it("should return 1 when get player two counter", () => {
        pointsCounter.incrementPlayerTwoCounter();
        const result: number = pointsCounter.getPlayerTwoCounter();
        expect(result).to.equal(1);
    });

    it("should return true when increment player one counter", () => {
        pointsCounter.incrementPlayerOneCounter();
        pointsCounter.incrementPlayerOneCounter();
        pointsCounter.incrementPlayerOneCounter();
        pointsCounter.incrementPlayerOneCounter();
        pointsCounter.incrementPlayerOneCounter();
        pointsCounter.incrementPlayerOneCounter();
        const result: boolean = pointsCounter.incrementPlayerOneCounter();

        expect(result).to.equal(true);
    });

    it("should return true when increment player two counter", () => {
        pointsCounter.incrementPlayerTwoCounter();
        pointsCounter.incrementPlayerTwoCounter();
        pointsCounter.incrementPlayerTwoCounter();
        pointsCounter.incrementPlayerTwoCounter();
        pointsCounter.incrementPlayerTwoCounter();
        pointsCounter.incrementPlayerTwoCounter();
        const result: boolean = pointsCounter.incrementPlayerTwoCounter();

        expect(result).to.equal(true);
    });

});
