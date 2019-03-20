import * as chai from "chai";
import * as fs from "fs";
import * as path from "path";
import { IHitToValidate } from "../../game/arena/interfaces";
import { HitValidatorService3D } from "../hitValidator3D.service";

// tslint:disable:no-magic-numbers no-any

let   mockAxios:            any;
const axios:                any         = require("axios");
const mockAdapter:          any         = require("axios-mock-adapter");
const sceneDataBuffer:      any         = fs.readFileSync(path.resolve(__dirname, "../../../asset/scene/2_scene.json"));

const iHitToValidate3D: IHitToValidate<number> = {
    eventInfo:          1,
    differenceDataURL:  path.resolve(__dirname, "../../../asset/scene/2_scene.json"),
};

let hitValidatorService3D: HitValidatorService3D = new HitValidatorService3D();

describe("Hit Validator 3D micro-service tests", () => {

    beforeEach(() => {
        mockAxios = new mockAdapter.default(axios);
    });

    afterEach(() => {
        mockAxios.restore();
    });

    it("should return missed hit and insert scene in cache", async () => {

        mockAxios.onGet(iHitToValidate3D.differenceDataURL, {
            responseType: "arraybuffer",
        })
        .reply(200, sceneDataBuffer);

        hitValidatorService3D.confirmHit(iHitToValidate3D).then((response: any) => {
            chai.expect(response).to.deep.equal({ isAHit: false, differenceIndex: -1 });
        }).catch();

    });

    it("should return missed hit and get scene in cache", async () => {

        mockAxios.onGet(iHitToValidate3D.differenceDataURL, {
            responseType: "arraybuffer",
        })
        .reply(200, sceneDataBuffer);

        hitValidatorService3D.confirmHit(iHitToValidate3D).then((response: any) => {
            chai.expect(response).to.deep.equal({ isAHit: false, differenceIndex: -1 });
        }).catch();

    });

    it("should return good hit and get scene in cache", async () => {

        mockAxios.onGet(iHitToValidate3D.differenceDataURL, {
            responseType: "arraybuffer",
        })
        .reply(200, sceneDataBuffer);

        iHitToValidate3D.eventInfo = 75;

        hitValidatorService3D.confirmHit(iHitToValidate3D).then((response: any) => {
            chai.expect(response).to.deep.equal({ isAHit: true, differenceIndex: 75 });
        }).catch();

    });

    it("should return and error of not getting scene buffer from url", async () => {

        mockAxios.onGet(iHitToValidate3D.differenceDataURL, {
            responseType: "arraybuffer",
        })
        .reply(400);

        hitValidatorService3D = new HitValidatorService3D();
        hitValidatorService3D.confirmHit(iHitToValidate3D).then().catch((error: any) => {
            chai.expect(error.message).to.equal("Didn't succeed to get scene buffer from URL given.");
        });

    });

    it("should return and error with wrong url", async () => {

        mockAxios.onGet("wrong url bro", {
            responseType: "arraybuffer",
        })
        .reply(400);

        hitValidatorService3D = new HitValidatorService3D();
        hitValidatorService3D.confirmHit(iHitToValidate3D).then().catch((error: any) => {
            chai.expect(error.message).to.equal("Didn't succeed to get scene buffer from URL given.");
        });

    });

});
