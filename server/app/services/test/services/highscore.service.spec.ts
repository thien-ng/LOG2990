import { expect } from "chai";
import { Highscore, Mode } from "../../../../../common/communication/highscore";
import { HighscoreService } from "../../../services/highscore.service";

const ZERO: number = 0;
const ONE: number = 1;
const TWO: number = 2;
const FOUR: number = 4;
const SIX: number = 6;
const SEVEN: number = 7;
const UNDEFINED: number = 100;
const THREE: number = 3;
const MOCK_SCORE_VALUE_1: number = 400;
const MOCK_SCORE_VALUE_2: number = 500;
const MOCK_SCORE_VALUE_3: number = 600;

describe("HighscoreService tests", () => {
    let mockHighscore: Highscore[];
    let highscoreService: HighscoreService;

    beforeEach(() => {
        mockHighscore = [
            {
                id: 1,
                timesSingle: [TWO, FOUR , SIX],
                timesMulti: [TWO, FOUR , SIX],
            },
            {
                id: 2,
                timesSingle: [TWO, FOUR , SIX],
                timesMulti: [TWO, FOUR , SIX],
            },
            {
                id: 3,
                timesSingle: [MOCK_SCORE_VALUE_1, MOCK_SCORE_VALUE_2, MOCK_SCORE_VALUE_3],
                timesMulti: [MOCK_SCORE_VALUE_1, MOCK_SCORE_VALUE_2, MOCK_SCORE_VALUE_3],
            },
        ];
        highscoreService = new HighscoreService();
        highscoreService.addHighscore(mockHighscore);
    });

    it("Should return the right highscore", () => {
        const updatedHS: Highscore | undefined = highscoreService.getHighscoreById(ONE);
        expect(updatedHS).deep.equal(mockHighscore[ZERO]);
    });
    it("Should update the single player highscore", () => {
        highscoreService.updateHighscore(ONE, Mode.Singleplayer, ONE);
        const index: number = highscoreService.findHighScoreByID(ONE);
        expect(highscoreService.allHighscores[index].timesSingle).deep.equal([ONE, TWO, FOUR]);
    });
    it("Should update the multi player highscore", () => {
        highscoreService.updateHighscore(ONE, Mode.Multiplayer, ONE);
        const index: number = highscoreService.findHighScoreByID(ONE);
        expect(highscoreService.allHighscores[index].timesMulti).deep.equal([ONE, TWO, FOUR]);
    });
    it("Should not update the highscore", () => {
        highscoreService.updateHighscore(SEVEN, Mode.Multiplayer, ONE);
        const index: number = highscoreService.findHighScoreByID(ONE);
        expect(highscoreService.allHighscores[index].timesMulti).deep.equal(mockHighscore[ZERO].timesMulti);
    });
    it("Should fail quietly and not update the highscores", () => {
        highscoreService.updateHighscore(ONE, UNDEFINED, ONE);
        const index: number = highscoreService.findHighScoreByID(ONE);
        expect(highscoreService.allHighscores[index].timesMulti).deep.equal([TWO, FOUR, SIX]);
    });
    it("Should generate new random score", () => {
        highscoreService.generateNewHighscore(THREE);
        expect(mockHighscore[TWO].timesMulti).not.deep.equal([MOCK_SCORE_VALUE_1, MOCK_SCORE_VALUE_2, MOCK_SCORE_VALUE_3]);
    });
    it("First score should be inferior to 2nd Score", () => {
        highscoreService.generateNewHighscore(THREE);
        expect(mockHighscore[TWO].timesMulti[ZERO]).to.be.lessThan(mockHighscore[TWO].timesMulti[ONE]);
    });
    it("2nd score should be inferior to 3rd score", () => {
        highscoreService.generateNewHighscore(THREE);
        expect(mockHighscore[TWO].timesMulti[ONE]).to.be.lessThan(mockHighscore[TWO].timesMulti[TWO]);
    });
    it("Should return the highscore message coresponding to the id", () => {
        const cardId: number = ONE;
        expect(highscoreService.convertToString(cardId).id).to.be.equal(cardId);
    });
    it("Should not change the mock highscores if cardId is undefined", () => {
        highscoreService.updateHighscore(ONE, Mode.Singleplayer, UNDEFINED);
        expect(highscoreService.allHighscores).to.deep.equal(mockHighscore);
    });
});
