import "reflect-metadata";

import * as chai from "chai";
import * as spies from "chai-spies";
import * as sinon from "sinon";
import { Timer } from "../../../services/game/arena/timer";

// tslint:disable:no-magic-numbers no-any

let timer: Timer;
let clock: any;

beforeEach(() => {
    // const timer: Timer = new Timer();
    chai.use(spies);
    timer = new Timer();

});

describe("Timer tests", async () => {

    it("should start the timer", async (done: Function) => {
        const spy: any = chai.spy.on(timer, "updateTimeSinceStart");
        timer.startTimer();

        setTimeout(() => {
            chai.expect(spy).to.have.been.called();
        },         1010);
        done();
    });

    it("should stop the timer", () => {
        const spy: any = chai.spy.on(timer, "stopTimer");

        timer.stopTimer();
        chai.expect(spy).to.have.been.called();
    });

});
