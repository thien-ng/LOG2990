import { expect } from "chai";
import { Highscore, Mode } from "../../../../common/communication/highscore";
import { HighscoreService } from "../../services/highscore.service";

const ONE: number = 1;
const TWO: number = 2;
const FOUR: number = 4;
const SIX: number = 6;
const SEVEN: number = 7;

const UNDEFINED_MODE: number = 100;

describe("HighscoreService tests", () => {
    const mockHighscore: Highscore[] = [
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
    const highscoreService: HighscoreService = new HighscoreService();

    it("Should return the right highscore", () => {
        highscoreService.addHighscore(mockHighscore);
        const updatedHS: Highscore | undefined = highscoreService.getHighscoreById(ONE);
        expect(updatedHS).deep.equal(mockHighscore[0]);
    });
    it("Should update the single player highscore", () => {
        highscoreService.addHighscore(mockHighscore);
        highscoreService.updateHighscore(ONE, Mode.Singleplayer, ONE);
        const updatedHS: Highscore | undefined = highscoreService.getHighscoreById(ONE);
        if (updatedHS !== undefined) {
            expect(updatedHS.timesSingle).deep.equal([ONE, TWO, FOUR]);
        }
    });
    it("Should update the multi player highscore", () => {
        highscoreService.addHighscore(mockHighscore);
        highscoreService.updateHighscore(ONE, Mode.Multiplayer, ONE);
        const updatedHS: Highscore | undefined = highscoreService.getHighscoreById(ONE);
        if (updatedHS !== undefined) {
            expect(updatedHS.timesMulti).deep.equal([ONE, TWO, FOUR]);
        }
    });
    it("Should not update the highscore", () => {
        highscoreService.addHighscore(mockHighscore);
        highscoreService.updateHighscore(SEVEN, Mode.Multiplayer, ONE);
        const updatedHS: Highscore | undefined = highscoreService.getHighscoreById(ONE);
        if (updatedHS !== undefined) {
            expect(updatedHS).deep.equal(mockHighscore[0]);
        }
    });
    it("Should fail quietly and not update the highscores", () => {
        highscoreService.addHighscore(mockHighscore);
        highscoreService.updateHighscore(ONE, UNDEFINED_MODE, ONE);
        const updatedHS: Highscore | undefined = highscoreService.getHighscoreById(ONE);
        if (updatedHS !== undefined) {
            expect(updatedHS.timesMulti).deep.equal([TWO, FOUR, SIX]);
        }
    });
});
