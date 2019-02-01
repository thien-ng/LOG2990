import { Pixel } from "./pixel";

export class Image {

    public constructor(private height: number, private width: number, private pixelList: Pixel[]) {
        // default constructor
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public getPixels(): Pixel[] {
        return this.pixelList;
    }

}
