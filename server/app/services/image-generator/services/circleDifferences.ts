interface IPosition2D {
    posX: number;
    posY: number;
}

export class CircleDifferences {
    private circledDifference: number[];
    // paramètre a mettre dans un objet
    public constructor(public differencesArray: number[], public width: number, public height: number) {
        // default constructor
        this.printToConsole();
    }

    private printToConsole(): void {
        let index: number = 0;
        this.differencesArray.forEach( (value: number) => {
            // tslint:disable-next-line:no-console
            process.stdout.write(value.toString());
            if (++index % this.width === 0) {
                process.stdout.write("\n");
            }
        });
    }

    private getCoordinate2DPixel(positionInArray: number): IPosition2D {
        const coordX: number = (positionInArray / this.width);
        const coordY: number = (positionInArray % this.width);

        return {
            posX: coordX,
            posY: coordY,
        };
    }

}

const differencesArray: number[] = [0, 0, 0, 1];
const width: number = 2;
const height: number = 2;
const circleDifferences: CircleDifferences = new CircleDifferences(differencesArray, width, height);
