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

    public getPixelList(): Pixel[] {
        return this.pixelList;
    }

    public isEqualDimension(image: Image): Boolean {
        return this.height === image.getHeight() && this.width === image.getWidth();
    }

}
