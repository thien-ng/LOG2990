interface IPosition2D {
    posX: number;
    posY: number;
}

export class CircleDifferences {

    private circledDifference: number[];
    // paramètre a mettre dans un objet

    public constructor(public differencesArray: number[], public width: number, public radius: number) {
        // default constructor
        // this.printToConsole();
        // process.stdout.write(String(this.isInAdjustedRadius(2.236)));
        this.printPositionSquareToProcess();
    }

    private printToConsole(): void {
        let index: number = 0;
        this.differencesArray.forEach((value: number) => {
            // tslint:disable-next-line:no-console
            process.stdout.write(value.toString());
            if (++index % this.width === 0) {
                process.stdout.write("\n");
            }
        });
    }

    // test affichage a delete
    private printPositionSquareToProcess(): void {
        let indexArray: number = 0;
        this.differencesArray.forEach((value: number) => {
            if (value === 1) {
                const startPosition: IPosition2D = this.getStartPositionSquare(indexArray);
                console.log("Start Position:\t [ " + startPosition.posX + ", " + startPosition.posY + " ]");
                const actualPosition: IPosition2D = this.getPosition(indexArray);
                console.log("Actual Position: [ " + actualPosition.posX + ", " + actualPosition.posY + " ]");
                const endPosition: IPosition2D = this.getEndPositionSquare(indexArray);
                console.log("End Position:\t [ " + endPosition.posX + ", " + endPosition.posY + " ]");
            }
            indexArray++;
        });
    }

    private getPosition(positionInArray: number): IPosition2D {
        const coordX: number = Math.floor(positionInArray / this.width);
        const coordY: number = (positionInArray % this.width);

        return {
            posX: coordX,
            posY: coordY,
        };
    }

    private findDistanceBetween(centerPosition: IPosition2D, periphericPosition: IPosition2D): number {
        const deltaX: number = periphericPosition.posX - centerPosition.posX;
        const deltaY: number = periphericPosition.posY - centerPosition.posY;

        return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    }

    private isInAdjustedRadius(distance: number): boolean {
        return distance < this.adjustedRadius();
    }

    private adjustedRadius(): number {
        const coefficient: number = 0.4461;
        const power: number = 0.9511;
        const adjustmentDegree: number = 0.9;

        const adjustment: number = adjustmentDegree * (coefficient / Math.pow(this.radius, power));

        return this.radius + adjustment;
    }

    private getStartPositionSquare(centerPositionInArray: number): IPosition2D {
        const startPositionInArray: number = centerPositionInArray - this.width * this.radius - this.radius;
        console.log(startPositionInArray);

        return this.getPosition(startPositionInArray);
    }

    private getEndPositionSquare(centerPositionInArray: number): IPosition2D {
        const endPositionInArray: number = centerPositionInArray + this.width * this.radius + this.radius;

        return this.getPosition(endPositionInArray);
    }
}

const RADIUS: number = 1;
const differencesArray2: number[] = [1, 0, 0, 0, 0, 0, 0, 0, 0];
const width2: number = 3;
const circleDifferences: CircleDifferences = new CircleDifferences(differencesArray2, width2, RADIUS);
