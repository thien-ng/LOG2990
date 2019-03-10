import { expect } from "chai";
import { Highscore, HighscoreMessage, Mode } from "../../../common/communication/highscore";
import { Constants } from "../constants";
import { HighscoreService } from "../services/highscore.service";

// tslint:disable:no-magic-numbers no-any no-floating-promises

const UNDEFINED:            number = 100;
let   mockAxios:            any;
const axios:                any     = require("axios");
const mockAdapter:          any     = require("axios-mock-adapter");

describe("HighscoreService tests", () => {
    let mockHighscore:              Highscore[];
    let highscoreService:           HighscoreService;

    const higscoreMessageExpected:  HighscoreMessage = {
        id:             4,
        timesMulti:     [{username: "cpu", time: "2:02"}, {username: "cpu", time: "2:04"}, {username: "cpu", time: "2:16"}],
        timesSingle:    [{username: "cpu", time: "2:02"}, {username: "cpu", time: "2:04"}, {username: "cpu", time: "2:16"}],
    };

    beforeEach(() => {
        mockAxios = new mockAdapter.default(axios);
        mockHighscore = [
            {
                id:             1,
                timesSingle:    [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
                timesMulti:     [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
            },
            {
                id:             2,
                timesSingle:    [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
                timesMulti:     [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
            },
            {
                id:             3,
                timesSingle:    [{username: "cpu", time: 400}, {username: "cpu", time: 500}, {username: "cpu", time: 600}],
                timesMulti:     [{username: "cpu", time: 400}, {username: "cpu", time: 500}, {username: "cpu", time: 600}],
            },
            {
                id:             4,
                timesSingle:    [{username: "cpu", time: 122}, {username: "cpu", time: 124}, {username: "cpu", time: 136}],
                timesMulti:     [{username: "cpu", time: 122}, {username: "cpu", time: 124}, {username: "cpu", time: 136}],
            },
        ];
        highscoreService = new HighscoreService();
        highscoreService["highscores"] = mockHighscore;
    });

    afterEach(() => {
        mockAxios.restore();
    });

    it("Should return the right highscore", () => {
        const updatedHS: Highscore | undefined = highscoreService.getHighscoreById(1);
        expect(updatedHS).deep.equal(mockHighscore[0]);
    });

    it("Should update the single player highscore", async () => {
        const answer: any = {
            id:             1,
            timesSingle:    [{username: "cpu", time: 1}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
            timesMulti:     [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
        };
        mockAxios.onPost(Constants.VALIDATE_HIGHSCORE_PATH)
        .reply(200, answer);

        await highscoreService.updateHighscore({username: "cpu", time: 1}, Mode.Singleplayer, 1);
        const index: number = highscoreService.findHighScoreByID(1);
        expect(highscoreService["highscores"][index]).deep.equal(answer);
    });

    it("Should update the multi player highscore", async () => {
        const answer: any = {
            id:             1,
            timesSingle:    [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
            timesMulti:     [{username: "cpu", time: 1}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
        };
        mockAxios.onPost(Constants.VALIDATE_HIGHSCORE_PATH)
        .reply(200, answer);

        await highscoreService.updateHighscore({username: "cpu", time: 1}, Mode.Multiplayer, 1);
        const index: number = highscoreService.findHighScoreByID(1);
        expect(highscoreService["highscores"][index]).deep.equal(answer);
    });

    it("Should not update the highscore", () => {
        const answer: any = [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}];
        mockAxios.onPost(Constants.VALIDATE_HIGHSCORE_PATH)
        .reply(200, answer);

        highscoreService.updateHighscore({username: "cpu", time: 7}, Mode.Multiplayer, 1);
        const index: number = highscoreService.findHighScoreByID(1);
        expect(highscoreService["highscores"][index].timesMulti).deep.equal(mockHighscore[0].timesMulti);
    });

    it("Should fail quietly and not update the highscores", () => {
        highscoreService.updateHighscore({username: "cpu", time: 1}, UNDEFINED, 1);
        const index: number = highscoreService.findHighScoreByID(1);
        expect(highscoreService["highscores"][index].timesMulti).deep.equal(mockHighscore[0].timesMulti);
    });

    it("Should generate new random score", () => {
        highscoreService.generateNewHighscore(3);
        expect(mockHighscore[2].timesMulti).not.deep.equal([400, 500, 600]);
    });

    it("First score should be inferior to 2nd Score", () => {
        highscoreService.generateNewHighscore(3);
        expect(mockHighscore[2].timesMulti[0].time).to.be.at.most(mockHighscore[2].timesMulti[1].time);
    });

    it("2nd score should be inferior to 3rd score", () => {
        highscoreService.generateNewHighscore(3);
        expect(mockHighscore[2].timesMulti[1].time).to.be.at.most(mockHighscore[2].timesMulti[2].time);
    });

    it("Should return the highscore message coresponding to the id", () => {
        const cardId: number = 1;
        expect(highscoreService.convertToString(cardId).id).to.be.equal(cardId);
    });

    it("Should not change the mock highscores if cardId is undefined", () => {
        highscoreService.updateHighscore({username: "cpu", time: 1}, Mode.Singleplayer, UNDEFINED);
        expect(highscoreService["highscores"]).to.deep.equal(mockHighscore);
    });

    it("Should add the zero if necessary", () => {
        expect(highscoreService.convertToString(4)).to.deep.equal(higscoreMessageExpected);
    });

    it("Should fail quietly if the post fails", async () => {
        highscoreService.updateHighscore({username: "cpu", time: 1}, Mode.Singleplayer, 1);
        expect(highscoreService["highscores"]).to.deep.equal(mockHighscore);
    });

    it("Should fail quietly if the response status is unexpected", () => {
        highscoreService["analyseHighscoreResponse"]({status: "undefined", result: ""}, 2);
        expect(highscoreService["highscores"]).to.deep.equal(mockHighscore);
    });
});
