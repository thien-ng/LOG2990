import { expect } from "chai";
import { Highscore, Mode } from "../../../../../common/communication/highscore";
import { HighscoreApiService } from "../highscore-api.service";

// tslint:disable:no-magic-numbers no-any

const UNDEFINED: number = 4;

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
   });
});
