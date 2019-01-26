import { expect } from "chai";
import { Highscore, Mode } from "../../../common/communication/highscore";
import { HighscoreService } from "./highscore.service";

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
    highscoreService.addHighscore(mockHighscore[0]);
    highscoreService.addHighscore(mockHighscore[1]);

    it("Should return the right highscore", () => {
        expect(highscoreService.getHighscoreById(1)).deep.equal(mockHighscore[0]);
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
    it("Should throw an error when invalid mode is passed", () => {
        expect(() => highscoreService.updateHighscore(ONE, UNDEFINED_MODE, ONE)).to.throw(Error);
    });
});
