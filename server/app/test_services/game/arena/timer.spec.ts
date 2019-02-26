import "reflect-metadata";

import * as chai from "chai";
import * as spies from "chai-spies";
import * as sinon from "sinon";
import { Timer } from "../../../services/game/arena/timer";

// tslint:disable:no-magic-numbers no-any

let timer: Timer;
let clock: any;

beforeEach(() => {
    chai.use(spies);
    timer = new Timer();
});

describe("Timer tests", async () => {

    it("should update the timer", async (done: Function) => {
        clock = sinon.useFakeTimers();

        timer.startTimer();
        clock.tick(1010);
        const secondSinceStart: number = timer.getTimeSinceStart();
        timer.stopTimer();
        chai.expect(secondSinceStart).to.equal(1);
        clock.restore();

        done();
    });

    it("should stop the timer", () => {
        clock = sinon.useFakeTimers();

        timer.startTimer();
        clock.tick(2019);
        timer.stopTimer();
        clock.tick(1010);

        const calculatedTimeSinceStart: number = timer.getTimeSinceStart();
        const expectedTimeSinceStart:   number = 2;

        chai.expect(calculatedTimeSinceStart).to.equal(expectedTimeSinceStart);
        clock.restore();

    });

    it("should start the timer", () => {
        const spy: any = chai.spy.on(timer, "startTimer");

        timer.startTimer();
        timer.stopTimer();
        chai.expect(spy).to.have.been.called();
    });
});
