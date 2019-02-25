export class PointsCounter {

    private counterPlayerOne:   number;
    private counterPlayerTwo:   number;
    private requiredCouner:     number;

    public constructor(requiredCouner: number) {
        this.counterPlayerOne = 0;
        this.counterPlayerTwo = 0;
        this.requiredCouner = requiredCouner;
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
        return this.requiredCouner === counter;
    }

}
