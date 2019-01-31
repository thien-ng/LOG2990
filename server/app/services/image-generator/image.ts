import { Pixel } from "./pixel";

export class Image {

    private readonly WIDTH_REQUIRED: number = 640;
    private readonly HEIGHT_REQUIRED: number = 480;

    public constructor(private height: number, private width: number, private pixelList: Pixel[]) {
        // default constructor
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getPixelList(): Pixel[] {
        return this.pixelList;
    }

    public hasRequiredDimension(): Boolean {
        return this.width === this.WIDTH_REQUIRED && this.height === this.HEIGHT_REQUIRED;
    }

}
