import * as chai from "chai";
import * as fs from "fs";
import * as path from "path";
import { IPosition2D } from "../../../../../common/communication/iGameplay";
import { HitValidatorService2D } from "../hitValidator2D.service";
import { IHitToValidate } from "../interfaces";

// tslint:disable:no-magic-numbers no-any

const iHitToValidate2D: IHitToValidate<IPosition2D> = {
    eventInfo: {
        x: 1,
        y: 1,
    },
    differenceDataURL:       path.resolve(__dirname, "../../../asset/image/testBitmap/imagetestOg.bmp"),
    colorToIgnore:  -1,
};

let   mockAxios:            any;
const axios:                any     = require("axios");
const mockAdapter:          any     = require("axios-mock-adapter");
const imageBuffer:          Buffer  = fs.readFileSync(path.resolve(__dirname, "../../../asset/image/testBitmap/imagetestOg.bmp"));

let   hitValidatorService:    HitValidatorService2D = new HitValidatorService2D();

describe("Hit Validator 2D micro-service tests", () => {

    beforeEach(() => {
        mockAxios = new mockAdapter.default(axios);
    });

    afterEach(() => {
        mockAxios.restore();
    });

    it("should return hit with color from pixel and insert image in cache", async () => {

        mockAxios.onGet(iHitToValidate2D.differenceDataURL, {
            responseType: "arraybuffer",
        })
        .reply(200, imageBuffer);

        hitValidatorService.confirmHit(iHitToValidate2D).then((response: any) => {
            chai.expect(response).to.deep.equal({ isAHit: true, differenceIndex: 255 });
        }).catch();
    });

    it("should return hit with color from pixel and get image from cache", async () => {

        mockAxios.onGet(iHitToValidate2D.differenceDataURL, {
            responseType: "arraybuffer",
        })
        .reply(200, imageBuffer);

        hitValidatorService.confirmHit(iHitToValidate2D).then((response: any) => {
            chai.expect(response).to.deep.equal({ isAHit: true, differenceIndex: 255 });
        }).catch();
    });

    it("should return and error of not getting image buffer from url", async () => {

        mockAxios.onGet(iHitToValidate2D.differenceDataURL, {
            responseType: "arraybuffer",
        })
        .reply(400);

        hitValidatorService = new HitValidatorService2D();
        hitValidatorService.confirmHit(iHitToValidate2D).then().catch((error: any) => {
            chai.expect(error.message).to
            .equal("Didn't succeed to get image buffer from URL given. File: hitValidator.service.ts. Line: 64.");
        });
    });

    it("should return and error with wrong url", async () => {

        mockAxios.onGet("wrong url bro", {
            responseType: "arraybuffer",
        })
        .reply(400);

        hitValidatorService = new HitValidatorService2D();
        hitValidatorService.confirmHit(iHitToValidate2D).then().catch((error: any) => {
            chai.expect(error.message).to
            .equal("Didn't succeed to get image buffer from URL given. File: hitValidator.service.ts. Line: 64.");
        });
    });
});
