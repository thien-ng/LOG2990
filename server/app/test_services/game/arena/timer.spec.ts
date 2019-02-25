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
        const spy: any = chai.spy.on(timer, "stopTimer");

        timer.startTimer();
        timer.stopTimer();
        chai.expect(spy).to.have.been.called();
    });
        timer.stopTimer();
        chai.expect(spy).to.have.been.called();
    });

});
