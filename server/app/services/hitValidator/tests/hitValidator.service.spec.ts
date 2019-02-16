import * as chai from "chai";
import { HitValidatorService } from "../hitValidator.service";

// tslint:disable:no-magic-numbers no-any

// const hitToValidate1: IHitToValidate = {
//     posX: 135,
//     posY: 298,
//     imageUrl: "url",
//     colorToIgnore: [ 255, 255, 255],
// };

// let hitValidatorService: HitValidatorService;

describe("Hit Validator micro-service tests", () => {

    beforeEach(() => {
        // hitValidatorService = new HitValidatorService;
    });

    it("should create an object of type Cache", (done: Function) => {

        chai.expect(new HitValidatorService()).instanceOf(HitValidatorService);
        done();
    });

});
