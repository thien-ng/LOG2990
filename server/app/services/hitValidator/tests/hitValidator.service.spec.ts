import * as chai from "chai";
import * as fs from "fs";
import * as path from "path";
import { HitValidatorService } from "../hitValidator.service";
import { IHitToValidate } from "../interfaces";

// tslint:disable:no-magic-numbers no-any

const iHitToValidate: IHitToValidate = {
    position: {
        x: 1,
        y: 1,
    },
    imageUrl:       path.resolve(__dirname, "../../../asset/image/testBitmap/imagetestOg.bmp"),
    colorToIgnore:  [],
};

let   mockAxios:              any;
const axios:                any     = require("axios");
const mockAdapter:          any     = require("axios-mock-adapter");
const imageBuffer:          Buffer  = fs.readFileSync(path.resolve(__dirname, "../../../asset/image/testBitmap/imagetestOg.bmp"));

let   hitValidatorService:    HitValidatorService = new HitValidatorService();

describe("Hit Validator micro-service tests", () => {

    beforeEach(() => {
        mockAxios = new mockAdapter.default(axios);
    });

    afterEach(() => {
        mockAxios.restore();
    });

    it("should return hit with color from pixel and insert image in cache", async () => {

        mockAxios.onGet(iHitToValidate.imageUrl, {
            responseType: "arraybuffer",
        })
        .reply(200, imageBuffer);

        hitValidatorService.confirmHit(iHitToValidate).then((response: any) => {
            chai.expect(response).to.deep.equal({ isAHit: true, hitPixelColor: [ 255, 255, 255 ] });
        }).catch();
    });

    it("should return hit with color from pixel and get image from cache", async () => {

        mockAxios.onGet(iHitToValidate.imageUrl, {
            responseType: "arraybuffer",
        })
        .reply(200, imageBuffer);

        hitValidatorService.confirmHit(iHitToValidate).then((response: any) => {
            chai.expect(response).to.deep.equal({ isAHit: true, hitPixelColor: [ 255, 255, 255 ] });
        }).catch();
    });

    it("should return and error of not getting image buffer from url", async () => {

        mockAxios.onGet(iHitToValidate.imageUrl, {
            responseType: "arraybuffer",
        })
        .reply(400);

        hitValidatorService = new HitValidatorService();
        hitValidatorService.confirmHit(iHitToValidate).then().catch((error: any) => {
            chai.expect(error.message).to
            .equal("Didn't succeed to get image buffer from URL given. File: hitValidator.service.ts. Line: 64.");
        });
    });

    it("should return and error with wrong url", async () => {

        mockAxios.onGet("wrong url bro", {responseType: "arraybuffer"})
        .reply(400);

        hitValidatorService = new HitValidatorService();
        hitValidatorService.confirmHit(iHitToValidate).then().catch((error: any) => {
            chai.expect(error.message).to
            .equal("Didn't succeed to get image buffer from URL given. File: hitValidator.service.ts. Line: 64.");
        });
    });

});
