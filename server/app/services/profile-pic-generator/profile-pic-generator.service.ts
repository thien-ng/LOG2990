import { injectable } from "inversify";
import { BMPBuilder } from "../difference-checker/utilities/bmpBuilder";

interface IColor {
    R: number;
    G: number;
    B: number;
}

@injectable()
export class ProfilePicGeneratorService {

    public  readonly COLOR_WHITE:   IColor = { R: 245,  G: 245, B: 245 };
    public  readonly COLOR_GREEN:   IColor = { R: 128,  G: 212, B: 59  };
    public  readonly COLOR_BLUE:    IColor = { R: 83,   G: 179, B: 243 };
    public  readonly COLOR_ORANGE:  IColor = { R: 255,  G: 181, B: 43  };
    public  readonly COLOR_PINK:    IColor = { R: 253,  G: 91,  B: 167 };

    private readonly colors: IColor[] = [
        this.COLOR_GREEN,
        this.COLOR_BLUE,
        this.COLOR_ORANGE,
        this.COLOR_PINK,
    ];
    private readonly multiplier: number = 20;

    public generateRandomImage(): Buffer  {

        const sizeOfSquare:     number      = 7;
        const builder:          BMPBuilder  = new BMPBuilder(sizeOfSquare * this.multiplier, sizeOfSquare * this.multiplier, 0);
        const color:            IColor      = this.getRandomColor();
        const middleOfSquare:   number      = this.getCeiledHalf(sizeOfSquare);

        for (let x: number = 0; x < middleOfSquare; x++) {
            for (let y: number = 0; y < sizeOfSquare; y++) {

                const isColor: boolean = this.randomBoolean();
                const colorToApply: IColor = isColor ? color : this.COLOR_WHITE;

                this.fillImage(builder, x, y, colorToApply);
                this.fillImage(builder, sizeOfSquare - 1 - x, y, colorToApply);
            }
        }

        return builder.buffer;
    }

    private getCeiledHalf(numberToDivide: number): number {
        const two: number = 2;

        return Math.ceil(numberToDivide / two) + 1;
    }

    private randomBoolean(): boolean {
        const two: number = 2;
        const sampleSize: number = 100;

        return Math.floor(Math.random() * sampleSize) % two === 0;
    }

    private fillImage(builder: BMPBuilder, x: number, y: number, color: IColor): void {
        for (let i: number = 0; i < this.multiplier; i++) {
            for (let j: number = 0; j < this.multiplier; j++) {
                builder.setColorAtPos(color.R, color.B, color.G, x * this.multiplier + i, y * this.multiplier + j);
            }
        }
    }

    private getRandomColor(): IColor {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
}
