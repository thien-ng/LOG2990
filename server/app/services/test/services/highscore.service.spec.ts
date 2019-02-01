// tslint:disable:no-magic-numbers
import { expect } from "chai";
import { Highscore, HighscoreMessage, Mode } from "../../../../../common/communication/highscore";
import { HighscoreService } from "../../../services/highscore.service";

const UNDEFINED: number = 100;
const MOCK_SCORE_VALUE_1: number = 400;
const MOCK_SCORE_VALUE_2: number = 500;
const MOCK_SCORE_VALUE_3: number = 600;

describe("HighscoreService tests", () => {
    let mockHighscore: Highscore[];
    let highscoreService: HighscoreService;
    const higscoreMessageExpected: HighscoreMessage = {
        id: 4,
        timesMulti: ["2:02", "2:04", "2:16"],
        timesSingle: ["2:02", "2:04", "2:16"],
    };

    beforeEach(() => {
        mockHighscore = [
            {
                id: 1,
                timesSingle: [2, 4 , 6],
                timesMulti: [2, 4 , 6],
            },
            {
                id: 2,
                timesSingle: [2, 4 , 6],
                timesMulti: [2, 4 , 6],
            },
            {
                id: 3,
                timesSingle: [MOCK_SCORE_VALUE_1, MOCK_SCORE_VALUE_2, MOCK_SCORE_VALUE_3],
                timesMulti: [MOCK_SCORE_VALUE_1, MOCK_SCORE_VALUE_2, MOCK_SCORE_VALUE_3],
            },
            {
                id: 4,
                timesSingle: [122, 124 , 136],
                timesMulti: [122, 124 , 136],
            },
        ];
        highscoreService = new HighscoreService();
        highscoreService.addHighscore(mockHighscore);
    });

    it("Should return the right highscore", () => {
        const updatedHS: Highscore | undefined = highscoreService.getHighscoreById(1);
        expect(updatedHS).deep.equal(mockHighscore[0]);
    });
    it("Should update the single player highscore", () => {
        highscoreService.updateHighscore(1, Mode.Singleplayer, 1);
        const index: number = highscoreService.findHighScoreByID(1);
        expect(highscoreService.allHighscores[index].timesSingle).deep.equal([1, 2, 4]);
    });
    it("Should update the multi player highscore", () => {
        highscoreService.updateHighscore(1, Mode.Multiplayer, 1);
        const index: number = highscoreService.findHighScoreByID(1);
        expect(highscoreService.allHighscores[index].timesMulti).deep.equal([1, 2, 4]);
    });
    it("Should not update the highscore", () => {
        highscoreService.updateHighscore(7, Mode.Multiplayer, 1);
        const index: number = highscoreService.findHighScoreByID(1);
        expect(highscoreService.allHighscores[index].timesMulti).deep.equal(mockHighscore[0].timesMulti);
    });
    it("Should fail quietly and not update the highscores", () => {
        highscoreService.updateHighscore(1, UNDEFINED, 1);
        const index: number = highscoreService.findHighScoreByID(1);
        expect(highscoreService.allHighscores[index].timesMulti).deep.equal([2, 4, 6]);
    });
    it("Should generate new random score", () => {
        highscoreService.generateNewHighscore(3);
        expect(mockHighscore[2].timesMulti).not.deep.equal([MOCK_SCORE_VALUE_1, MOCK_SCORE_VALUE_2, MOCK_SCORE_VALUE_3]);
    });
    it("First score should be inferior to 2nd Score", () => {
        highscoreService.generateNewHighscore(3);
        expect(mockHighscore[2].timesMulti[0]).to.be.lessThan(mockHighscore[2].timesMulti[1]);
    });
    it("2nd score should be inferior to 3rd score", () => {
        highscoreService.generateNewHighscore(3);
        expect(mockHighscore[2].timesMulti[1]).to.be.lessThan(mockHighscore[2].timesMulti[2]);
    });
    it("Should return the highscore message coresponding to the id", () => {
        const cardId: number = 1;
        expect(highscoreService.convertToString(cardId).id).to.be.equal(cardId);
    });
    it("Should not change the mock highscores if cardId is undefined", () => {
        highscoreService.updateHighscore(1, Mode.Singleplayer, UNDEFINED);
        expect(highscoreService.allHighscores).to.deep.equal(mockHighscore);
    });
    it("Should add the zero if necessary", () => {
        expect(highscoreService.convertToString(4)).to.deep.equal(higscoreMessageExpected);
    });
});
