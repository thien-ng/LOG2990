import { expect } from "chai";
import { Highscore, Mode } from "../../../../../common/communication/highscore";
import { HighscoreService } from "../../../services/highscore.service";

const ONE: number = 1;
const TWO: number = 2;
const FOUR: number = 4;
const SIX: number = 6;
const SEVEN: number = 7;
const UNDEFINED_MODE: number = 100;

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
        ];
        highscoreService = new HighscoreService();
        highscoreService.addHighscore(mockHighscore);
    });

    it("Should return the right highscore", () => {
        const updatedHS: Highscore | undefined = highscoreService.getHighscoreById(ONE);
        expect(updatedHS).deep.equal(mockHighscore[0]);
    });
    it("Should update the single player highscore", () => {
        highscoreService.updateHighscore(ONE, Mode.Singleplayer, ONE);
        const updatedHS: Highscore | undefined = highscoreService.getHighscoreById(ONE);
        if (updatedHS !== undefined) {
            expect(updatedHS.timesSingle).deep.equal([ONE, TWO, FOUR]);
        }
    });
    it("Should update the multi player highscore", () => {
        highscoreService.updateHighscore(ONE, Mode.Multiplayer, ONE);
        const updatedHS: Highscore | undefined = highscoreService.getHighscoreById(ONE);
        if (updatedHS !== undefined) {
            expect(updatedHS.timesMulti).deep.equal([ONE, TWO, FOUR]);
        }
    });
    it("Should not update the highscore", () => {
        highscoreService.updateHighscore(SEVEN, Mode.Multiplayer, ONE);
        const updatedHS: Highscore | undefined = highscoreService.getHighscoreById(ONE);
        if (updatedHS !== undefined) {
            expect(updatedHS).deep.equal(mockHighscore[0]);
        }
    });
    it("Should fail quietly and not update the highscores", () => {
        highscoreService.updateHighscore(ONE, UNDEFINED_MODE, ONE);
        const updatedHS: Highscore | undefined = highscoreService.getHighscoreById(ONE);
        if (updatedHS !== undefined) {
            expect(updatedHS.timesMulti).deep.equal([TWO, FOUR, SIX]);
        }
    });
});
