import * as chai from "chai";
import * as spies from "chai-spies";
import * as SocketIO from "socket.io";
import { mock } from "ts-mockito";
import {
    Highscore,
    HighscoreMessage,
    HighscoreValidationMessage,
    HighscoreValidationResponse,
    Mode } from "../../../common/communication/highscore";
import { CCommon } from "../../../common/constantes/cCommon";
import { CServer } from "../CServer";
import { AssetManagerService } from "../services/asset-manager.service";
import { HighscoreService } from "../services/highscore.service";

// tslint:disable:no-magic-numbers no-any no-floating-promises max-line-length arrow-return-shorthand

let   mockAxios:            any;
const MAX_TIME:             number = 600;
const MIN_TIME:             number = 180;
const axios:                any     = require("axios");
const mockAdapter:          any     = require("axios-mock-adapter");

describe("HighscoreService tests", () => {
    let mockHighscore:              Highscore[];
    let highscoreService:           HighscoreService;
    let assetManager:               AssetManagerService;

    const higscoreMessageExpected:  HighscoreMessage = {
        id:             1,
        timesMulti:     [{username: "cpu", time: "0:02"}, {username: "cpu", time: "0:04"}, {username: "cpu", time: "0:06"}],
        timesSingle:    [{username: "cpu", time: "0:02"}, {username: "cpu", time: "0:04"}, {username: "cpu", time: "0:06"}],
    };

    beforeEach(() => {
        chai.use(spies);
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
        assetManager     = new AssetManagerService();
        highscoreService = new HighscoreService(assetManager);
        highscoreService["highscores"] = mockHighscore;
        highscoreService["socketServer"] = mock(SocketIO);
    });

    afterEach(() => {
        mockAxios.restore();
    });

    it("should set socket server", () => {
        const mockSocket: any = mock(SocketIO);
        highscoreService.setServer(mockSocket);
        chai.expect(highscoreService["socketServer"]).to.equal(mockSocket);
    });

    it("should return the right highscore when getting highscore by id", () => {
        chai.spy.on(highscoreService["assetManager"], "getHighscoreById", () => {return mockHighscore[0]; });
        const updatedHS: HighscoreMessage = highscoreService.getHighscoreById(1);
        chai.expect(updatedHS).deep.equal(higscoreMessageExpected);
    });

    it("should return the error when getting highscore by id", () => {
        chai.spy.on(highscoreService["assetManager"], "getHighscoreById", () => {return; });
        const updatedHS: HighscoreMessage = highscoreService.getHighscoreById(1);
        chai.expect(updatedHS).deep.equal({id: -1});
    });

    it("Should update the single player highscore", async () => {
        const answer: any = {
            status: CCommon.ON_SUCCESS,
            isNewHighscore: true,
            index: 0,
            highscore: {
                id:             1,
                timesSingle:    [{username: "cpu", time: 1}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
                timesMulti:     [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
            },
        };

        mockAxios.onPost(CServer.VALIDATE_HIGHSCORE_PATH).reply(200, answer);

        const spy: any = chai.spy.on(highscoreService["assetManager"], "saveHighscore", () => {return; });
        await highscoreService.updateHighscore({username: "cpu", time: 1}, Mode.Singleplayer, 1);
        chai.expect(spy).to.have.been.called();
    });

    it("Should update the multi player highscore", async () => {
        const answer: any = {
            status: CCommon.ON_SUCCESS,
            isNewHighscore: true,
            index: 0,
            highscore: {
                id:             1,
                timesSingle:    [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
                timesMulti:     [{username: "cpu", time: 1}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
            },
        };
        mockAxios.onPost(CServer.VALIDATE_HIGHSCORE_PATH).reply(200, answer);

        const spy: any = chai.spy.on(highscoreService["assetManager"], "saveHighscore", () => {return; });
        await highscoreService.updateHighscore({username: "cpu", time: 1}, Mode.Multiplayer, 1);
        chai.expect(spy).to.have.been.called();
    });

    it("Should not update multiplayer or singleplayer highscore", async () => {
        const answer: any = {
            status: CCommon.ON_SUCCESS,
            isNewHighscore: true,
            index: 0,
            highscore: {
                id:             1,
                timesSingle:    [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
                timesMulti:     [{username: "cpu", time: 1}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
            },
        };
        mockAxios.onPost(CServer.VALIDATE_HIGHSCORE_PATH).reply(200, answer);

        chai.spy.on(highscoreService["assetManager"], "saveHighscore", () => {return; });
        await highscoreService.updateHighscore({username: "cpu", time: 1}, 9, 1).then().catch((error: any) => {
            chai.expect(error.message).to.equal("Wrong type of game mode.");
        });
    });

    it("Should not update the highscore when validating values", async () => {
        const message:  HighscoreValidationMessage = {
            newValue:       {username: "name", time: 1},
            mode:           Mode.Multiplayer,
            times:          mockHighscore[0],
        };
        const highscoreToChange: Highscore = mockHighscore[0];
        const answer: HighscoreValidationResponse = {
                status: CCommon.ON_SUCCESS,
                isNewHighscore: false,
                index: -1,
                highscore: mockHighscore[0],
        };
        mockAxios.onPost(CServer.VALIDATE_HIGHSCORE_PATH)
        .reply(200, answer);

        chai.spy.on(highscoreService["assetManager"], "saveHighscore", () => {return; });
        await highscoreService["validateHighscore"](message, highscoreToChange);
        chai.expect(highscoreToChange).deep.equal(mockHighscore[0]);
    });

    it("Should throw an error when validating highschore", async () => {
        const message:  HighscoreValidationMessage = {
            newValue:       {username: "name", time: 1},
            mode:           Mode.Multiplayer,
            times:          mockHighscore[0],
        };
        const highscoreToChange: Highscore = mockHighscore[0];
        const answer: HighscoreValidationResponse = {
                status: CCommon.ON_SUCCESS,
                isNewHighscore: false,
                index: -1,
                highscore: mockHighscore[0],
        };
        mockAxios.onPost(CServer.VALIDATE_HIGHSCORE_PATH)
        .reply(200, answer);

        chai.spy.on(highscoreService["assetManager"], "saveHighscore", () => {throw new TypeError("fuck off"); });
        await highscoreService["validateHighscore"](message, highscoreToChange).catch((error: any) => {
            chai.expect(error.message).to.equal("fuck off");
        });
    });

    it("Should generate new random score", () => {

        chai.spy.on(highscoreService["assetManager"], "saveHighscore", () => {return; });
        highscoreService.generateNewHighscore(3);

        const time1: boolean = highscoreService["newHighscore"].timesMulti[0].time >= MIN_TIME && highscoreService["newHighscore"].timesMulti[0].time <= MAX_TIME;
        const time2: boolean = highscoreService["newHighscore"].timesMulti[1].time >= MIN_TIME && highscoreService["newHighscore"].timesMulti[1].time <= MAX_TIME;
        const time3: boolean = highscoreService["newHighscore"].timesMulti[2].time >= MIN_TIME && highscoreService["newHighscore"].timesMulti[2].time <= MAX_TIME;
        chai.expect(time1 && time2 && time3).to.equal(true);
    });

    it("Should generate new random score with a time an a username", () => {
        chai.spy.on(highscoreService["assetManager"], "saveHighscore", () => {return; });
        highscoreService.generateNewHighscore(3);
        chai.expect(highscoreService["newHighscore"].timesMulti[0]).to.have.all.keys("username", "time");
    });

    it("should have first score to be inferior to 2nd Score", () => {
        chai.spy.on(highscoreService["assetManager"], "saveHighscore", () => {return; });
        highscoreService.generateNewHighscore(3);
        chai.expect(highscoreService["newHighscore"].timesMulti[0].time).to.be.at.most(highscoreService["newHighscore"].timesMulti[1].time);
    });

    it("should have second score to be inferior to 3rd score", () => {
        chai.spy.on(highscoreService["assetManager"], "saveHighscore", () => {return; });
        highscoreService.generateNewHighscore(3);
        chai.expect(highscoreService["newHighscore"].timesMulti[1].time).to.be.at.most(highscoreService["newHighscore"].timesMulti[2].time);
    });

    it("Should return the highscore message coresponding to the id", () => {
        chai.spy.on(highscoreService["assetManager"], "getHighscoreById", () => {return mockHighscore[0]; });
        const gameID: number = 1;
        chai.expect(highscoreService.getHighscoreById(gameID).id).to.be.equal(gameID);
    });

    it("Should add the zero if necessary", () => {
        const messageExpected: HighscoreMessage = {
            id:             4,
            timesMulti:     [{username: "cpu", time: "2:02"}, {username: "cpu", time: "2:04"}, {username: "cpu", time: "2:16"}],
            timesSingle:    [{username: "cpu", time: "2:02"}, {username: "cpu", time: "2:04"}, {username: "cpu", time: "2:16"}],
        };
        chai.spy.on(highscoreService["assetManager"], "getHighscoreById", () => {return mockHighscore[3]; });
        chai.expect(highscoreService.getHighscoreById(4)).to.deep.equal(messageExpected);
    });

});
