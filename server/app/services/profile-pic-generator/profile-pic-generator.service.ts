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
        this.COLOR_WHITE,
        this.COLOR_GREEN,
        this.COLOR_BLUE,
        this.COLOR_ORANGE,
        this.COLOR_PINK,
    ];
    private readonly multiplier: number = 20;
    private getRandomColor(): IColor {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
}
