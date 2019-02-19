import * as chai from "chai";
import { HitValidatorService } from "../hitValidator.service";

// tslint:disable:no-magic-numbers no-any

describe("Hit Validator micro-service tests", () => {

    beforeEach(() => { /* */ });

    it("should create an object of type Cache", (done: Function) => {

        chai.expect(new HitValidatorService()).instanceOf(HitValidatorService);
        done();
    });

});
