import { injectable } from "inversify";
import { IProfileRequest } from "../../../../common/communication/iUser";
import { BMPBuilder } from "../difference-checker/utilities/bmpBuilder";

interface IColor {
    R: number;
    G: number;
    B: number;
}

@injectable()
export class ProfilePicGeneratorService {

    private readonly COLOR_WHITE:   IColor = { R: 245,  G: 245, B: 245 };
    private readonly COLOR_GREEN:   IColor = { R: 128,  G: 212, B: 59  };
    private readonly COLOR_BLUE:    IColor = { R: 83,   G: 179, B: 243 };
    private readonly COLOR_ORANGE:  IColor = { R: 255,  G: 181, B: 43  };
    private readonly COLOR_PINK:    IColor = { R: 253,  G: 91,  B: 167 };

    private readonly COLORS: IColor[] = [
        this.COLOR_GREEN,
        this.COLOR_BLUE,
        this.COLOR_ORANGE,
        this.COLOR_PINK,
    ];
    private readonly MULTIPLIER: number = 40;

    public generateRandomImage(request: IProfileRequest): Buffer  {

        const sizeOfSquare:     number      = 7;
        const builder:          BMPBuilder  = new BMPBuilder(sizeOfSquare * this.MULTIPLIER, sizeOfSquare * this.MULTIPLIER, 0);
        const color:            IColor      = (request.color) ? request.color : this.getRandomColor();
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
        const denominator: number = 2;

        return Math.ceil(numberToDivide / denominator) + 1;
    }

    private randomBoolean(): boolean {
        const denominator: number = 2;
        const sampleSize: number = 100;

        return Math.floor(Math.random() * sampleSize) % denominator === 0;
    }

    private fillImage(builder: BMPBuilder, x: number, y: number, color: IColor): void {
        for (let i: number = 0; i < this.MULTIPLIER; i++) {
            for (let j: number = 0; j < this.MULTIPLIER; j++) {
                builder.setColorAtPos(color.R, color.G, color.B, x * this.MULTIPLIER + i, y * this.MULTIPLIER + j);
            }
        }
    }

    private getRandomColor(): IColor {
        return this.COLORS[Math.floor(Math.random() * this.COLORS.length)];
    }
}
