import { expect } from "chai";
import { HighscoreApiService } from "../highscore-api.service";
import { Highscore, HighscoreValidationMessage, HighscoreValidationResponse, Mode } from "../utilities/interfaces";

// tslint:disable:no-magic-numbers no-any

const UNDEFINED:                number = 4;
const INVALID_MODE:             string = "invalidMode";
const INVALID_PARAMS_VALUE:     string = "invalidParamsValue";
const INVALID_PARAMS:           string = "invalidParams";

let highscoreService: HighscoreApiService;
let mockHighscore: Highscore;

describe("Highscore micro service tests", () => {

    beforeEach(() => {
        mockHighscore = {
            id:             1,
            timesSingle:    [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
            timesMulti:     [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
        };
        highscoreService = new HighscoreApiService();
   });

    it("Should return a status saying that the parameters values are invalid if the time is negative", () => {
        const param: HighscoreValidationMessage = {
            newValue: {username: "cpu", time: -1},
            mode: Mode.Singleplayer,
            times: mockHighscore,
        };
        const newHighscore: HighscoreValidationResponse = highscoreService.checkScoreRoutine(param);
        expect(newHighscore.status).to.be.equal(INVALID_PARAMS_VALUE);
    });

    it("Should update the times when the new value is smaller than any of the previous highscores (singleplayer)", () => {
        const param: HighscoreValidationMessage = {
            newValue: {username: "cpu", time: 1},
            mode: Mode.Singleplayer,
            times: mockHighscore,
        };
        const newHighscore: HighscoreValidationResponse = highscoreService.checkScoreRoutine(param);
        expect(newHighscore.highscore.timesSingle[0].time).to.be.equal(1);
    });

    it("Should update the times when the new value is smaller than any of the previous highscores (multiplayer)", () => {
        const param: HighscoreValidationMessage = {
            newValue: {username: "cpu", time: 1},
            mode: Mode.Multiplayer,
            times: mockHighscore,
        };
        const newHighscore: HighscoreValidationResponse = highscoreService.checkScoreRoutine(param);
        expect(newHighscore.highscore.timesMulti[0].time).to.be.equal(1);
    });

    it("Should update the times when the new value is equal to the first highscore (singleplayer)", () => {
        const param: HighscoreValidationMessage = {
            newValue: {username: "cpu2", time: 2},
            mode: Mode.Singleplayer,
            times: mockHighscore,
        };
        const newHighscore: HighscoreValidationResponse = highscoreService.checkScoreRoutine(param);
        expect(newHighscore.highscore.timesSingle[1]).to.be.equal(param.newValue);
    });

    it("Should update the times when the new value is equal to the first highscore (multiplayer)", () => {
        const param: HighscoreValidationMessage = {
            newValue: {username: "cpu2", time: 2},
            mode: Mode.Multiplayer,
            times: mockHighscore,
        };
        const newHighscore: HighscoreValidationResponse = highscoreService.checkScoreRoutine(param);
        expect(newHighscore.highscore.timesMulti[1]).to.be.equal(param.newValue);
    });

    it("Should not update the times when all of the highscores are equal (singleplayer)", () => {
        const param1: HighscoreValidationMessage = {
            newValue: {username: "cpu", time: 2},
            mode: Mode.Singleplayer,
            times: mockHighscore,
        };
        highscoreService.checkScoreRoutine(param1);
        highscoreService.checkScoreRoutine(param1);

        const param2: HighscoreValidationMessage = {
            newValue: {username: "cpu2", time: 2},
            mode: Mode.Singleplayer,
            times: mockHighscore,
        };
        const newHighscore: HighscoreValidationResponse = highscoreService.checkScoreRoutine(param2);
        expect(newHighscore.highscore.timesSingle[0]).to.deep.equal(param1.newValue);
        expect(newHighscore.highscore.timesSingle[1]).to.deep.equal(param1.newValue);
        expect(newHighscore.highscore.timesSingle[2]).to.deep.equal(param1.newValue);
    });

    it("Should not update the times when all of the highscores are equal (multiplayer)", () => {
        const param1: HighscoreValidationMessage = {
            newValue: {username: "cpu", time: 2},
            mode: Mode.Multiplayer,
            times: mockHighscore,
        };
        highscoreService.checkScoreRoutine(param1);
        highscoreService.checkScoreRoutine(param1);

        const param2: HighscoreValidationMessage = {
            newValue: {username: "cpu2", time: 2},
            mode: Mode.Multiplayer,
            times: mockHighscore,
        };
        const newHighscore: HighscoreValidationResponse = highscoreService.checkScoreRoutine(param2);
        expect(newHighscore.highscore.timesMulti[0]).to.deep.equal(param1.newValue);
        expect(newHighscore.highscore.timesMulti[1]).to.deep.equal(param1.newValue);
        expect(newHighscore.highscore.timesMulti[2]).to.deep.equal(param1.newValue);
    });

    it("Should return a status saying that the parameters values are invalid if the mode is undefined", () => {
        const param: HighscoreValidationMessage = {
            newValue: {username: "cpu", time: 1},
            mode: UNDEFINED,
            times: mockHighscore,
        };
        const newHighscore: HighscoreValidationResponse = highscoreService.checkScoreRoutine(param);
        expect(newHighscore.status).to.be.equal(INVALID_PARAMS_VALUE);
    });

    it("Should return an error status if the parameters are not as expected", () => {
        const param: any = {
            invalid: "params",
        };
        const newHighscore: HighscoreValidationResponse = highscoreService.checkScoreRoutine(param);
        expect(newHighscore.status).to.be.equal(INVALID_PARAMS);
    });

    });
});
