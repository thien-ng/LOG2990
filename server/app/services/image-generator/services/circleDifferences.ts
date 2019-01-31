export class CircleDifferences {

    private circledDifferenceList: number[];

    public constructor(public differencesArray: number[], public width: number, public radius: number) {
        // default constructor
        this.circledDifferenceList = JSON.parse(JSON.stringify(differencesArray));
    }

    public printToConsole(): void {
        let index: number = 0;
        this.differencesArray.forEach((value: number) => {
            // A ENLEVER
            process.stdout.write(value.toString());
            if (++index % this.width === 0) {
                // A ENLEVER
                process.stdout.write("\n");
            }
        });
        console.log();
        this.circledDifferenceList.forEach((value: number) => {
            // A ENLEVER
            process.stdout.write(value.toString());
            if (++index % this.width === 0) {
                // A ENLEVER
                process.stdout.write("\n");
            }
        });
    }

    public circleAllDifferences(): void {
        let index: number = 0;

        this.differencesArray.forEach( (value: number) => {
            //
            if (value === 1) {
                this.drawCircle(index);
            }
            index++;
        });
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
        const coefficient: number = 0.4461;
        const power: number = 0.9511;
        const adjustmentDegree: number = 1.1;
        const adjustment: number = adjustmentDegree * (coefficient / Math.pow(this.radius, power));

        return this.radius + adjustment;
    }

    private getSquareStartIndex(centerPositionIndex: number): number {
        return centerPositionIndex - this.width * this.radius - this.radius;
    }

    private drawCircle(positionToCircle: number): void {
        const squareSize: number = this.radius + this.radius + 1;
        const startIndex: number = this.getSquareStartIndex(positionToCircle);

        for (let row: number = 0; row < squareSize; row++) {
            for (let col: number = 0; col < squareSize; col++) {

                const currentPosition: number = row * this.width + col + startIndex;
                if (currentPosition >= 0 && currentPosition < this.differencesArray.length) {
                    const currentDistanceToCenter: number = this.findDistanceBetween(positionToCircle, currentPosition);
                    console.log("Distance " + currentDistanceToCenter + " for index " + currentPosition);
                    if (this.isInAdjustedRadius(currentDistanceToCenter)) {
                        this.circledDifferenceList[currentPosition] = 1;
                    }
                }
            }
        }
    }
}

const RADIUS: number = 3;
const differencesArray2: number[] = [0, 0, 0, 0, 0 , 0, 0, 0, 0,
                                     0, 0, 0, 0, 0 , 0, 0, 0, 1,
                                     0, 0, 0, 0, 0 , 0, 0, 0, 0,
                                     0, 0, 0, 0, 0 , 0, 0, 0, 0,
                                     0, 0, 0, 0, 0 , 0, 0, 0, 0,
                                     0, 0, 0, 0, 0 , 0, 0, 0, 0,
                                     0, 0, 0, 0, 0 , 0, 0, 0, 0,
                                     0, 0, 0, 0, 0 , 0, 0, 0, 0,
                                     0, 0, 0, 0, 0 , 0, 0, 0, 0];
const width2: number = 9;
const circleDifferences: CircleDifferences = new CircleDifferences(differencesArray2, width2, RADIUS);
circleDifferences.printToConsole();
console.log();
circleDifferences.circleAllDifferences();
circleDifferences.printToConsole();
