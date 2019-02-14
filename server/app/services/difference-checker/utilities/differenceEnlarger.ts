import { injectable } from "inversify";

@injectable()
export class DifferenceEnlarger {

    private readonly IS_A_DIFFERENCE: number = 0;

    private enlargedDifferences: Buffer;

    public constructor(public readonly differencesFound: Buffer, public width: number, public radius: number) {
        this.enlargedDifferences = Buffer.from(differencesFound);
    }

    public circleAllDifferences(): Buffer {
        let index: number = 0;

        this.differencesFound.forEach( (value: number) => {
            if (value === this.IS_A_DIFFERENCE) {
                this.drawCircle(index);
            }
            index++;
        });

        return this.enlargedDifferences;
    }

    private drawCircle(positionToCircle: number): void {
        // to get the square size where the draw circle should be called
        const squareSize: number = this.radius + this.radius + 1;
        const startIndex: number = this.getSquareStartIndex(positionToCircle);

        for (let row: number = 0; row < squareSize; row++) {
            for (let col: number = 0; col < squareSize; col++) {

                const currentPosition: number = row * this.width + col + startIndex;
                if (currentPosition >= 0 && currentPosition < this.differencesFound.length) {
                    const currentDistanceToCenter: number = this.findDistanceBetween(positionToCircle, currentPosition);

                    if (this.isInAdjustedRadius(currentDistanceToCenter)) {
                        this.enlargedDifferences[currentPosition] = this.IS_A_DIFFERENCE;
                    }
                }
            }
        }
    }

    private getSquareStartIndex(centerPositionIndex: number): number {
        return centerPositionIndex - this.width * this.radius - this.radius;
    }

    private findDistanceBetween(centerPosition: number, periphericPosition: number): number {
        const deltaX: number = periphericPosition % this.width - centerPosition % this.width;
        const deltaY: number = Math.floor(periphericPosition / this.width) - Math.floor(centerPosition / this.width);

        return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    }

    private isInAdjustedRadius(distance: number): boolean {
        return distance < this.adjustedRadius();
    }

    private adjustedRadius(): number {
        // adjustment formula
        const COEFFICIENT: number = 0.4461;
        const POWER: number = 0.9511;
        const ADJUSTMENT_DEGREE: number = 1.1;
        const adjustment: number = ADJUSTMENT_DEGREE * (COEFFICIENT / Math.pow(this.radius, POWER));

        return this.radius + adjustment;
    }

}
