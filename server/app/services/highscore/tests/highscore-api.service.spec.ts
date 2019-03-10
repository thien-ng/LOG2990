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
        const newHighscore: Highscore = highscoreService.checkScore({username: "cpu", time: 1}, mockHighscore, Mode.Multiplayer);
        expect(newHighscore.timesMulti[0].time).to.be.equal(1);
    });

    it("Should fail quietly if the mode is undefined", () => {
        const newHighscore: Highscore = highscoreService.checkScore({username: "cpu", time: 1}, mockHighscore, UNDEFINED);
        expect(newHighscore).to.be.equal(mockHighscore);
    });
});
