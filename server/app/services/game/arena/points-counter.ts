import { Constants } from "../../../constants";

export class PointsCounter {

    private counterPlayerOne: number;
    private counterPlayerTwo: number;

    public constructor() {
        this.counterPlayerOne = 0;
        this.counterPlayerTwo = 0;
    }

    public getPlayerOneCounter(): number {
        return this.counterPlayerOne;
    }

    public getPlayerTwoCounter(): number {
        return this.counterPlayerTwo;
    }

    public incrementPlayerOneCounter(): boolean {
        return this.hasRequiredNumber(++this.counterPlayerOne);
    }

    public incrementPlayerTwoCounter(): boolean {
        return this.hasRequiredNumber(++this.counterPlayerTwo);
    }

    private hasRequiredNumber(counter: number): boolean {
        return Constants.REQUIRED_DIFFERENCE_FOUND === counter;
    }

}
