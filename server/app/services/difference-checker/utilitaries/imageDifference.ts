import { injectable } from "inversify";
import * as Jimp from "jimp";
import { Image } from "./image";
import { Pixel } from "./pixel";

@injectable()
export class ImageDifference {

    private readonly VALUE_DIFFERENCE: number = 1;
    private readonly VALUE_EQUAL: number = 0;
    private readonly WIDTH_REQUIRED: number = 640;
    private readonly HEIGHT_REQUIRED: number = 480;

    private jimp: Jimp = require("Jimp");
    private imageOriginal: Image;
    private imageWithdots: Image;
    private differenceImage: number[];

    public constructor() {
        this.differenceImage = [];
    }

    public async searchDifferenceImage(originalBuffer: Buffer, differenceBuffer: Buffer): Promise<number[]> {

        await this.readFile(originalBuffer, differenceBuffer);

        if (this.hasRequiredDimension(this.imageOriginal) && this.hasRequiredDimension(this.imageWithdots)) {

            this.findDifference();

            return this.differenceImage;

        } else {

            throw new TypeError("Un des images entrees, n'a pas les bonne dimensions");
        }

    }

    private async readFile(originalBuffer: Buffer, differenceBuffer: Buffer): Promise<void> {
        // We couldn't avoid the code duplication in this method
        await this.jimp.read(originalBuffer).then( (image: Jimp) => {
            this.imageOriginal = this.createImage(
                                    image.bitmap.height,
                                    image.bitmap.width,
                                    image.bitmap.data,
                                );
        });

        await this.jimp.read(differenceBuffer).then( (image: Jimp) => {
            this.imageWithdots = this.createImage(
                                    image.bitmap.height,
                                    image.bitmap.width,
                                    image.bitmap.data,
                                );
        });
    }

    private createImage(height: number, width: number, valueListBuffer: Buffer): Image {
            const pixelValueList: number[] = Array.prototype.slice.call(valueListBuffer, 0);

            return new Image(
                    height,
                    width,
                    this.transformToPixel(pixelValueList),
                );
        }

    private transformToPixel(data: number[]): Pixel[] {

        const arrayPixel: Pixel[] = [];

        let pixelCounter: number = 0;
        while (pixelCounter < data.length) {
            const redValue: number = data[pixelCounter++];
            const greenValue: number = data[pixelCounter++];
            const blueValue: number = data[pixelCounter++];

            // decommenter si jimp redonne des alpha
            // pixelCounter++

            const pixel: Pixel = new Pixel(redValue, greenValue, blueValue);
            arrayPixel.push(pixel);
        }

        return arrayPixel;
    }

    private findDifference(): void {

        const imageOg: Pixel[] = this.imageOriginal.getPixels();
        const imageDots: Pixel[] = this.imageWithdots.getPixels();

        for (let i: number = 0; i < this.imageOriginal.getPixels().length; i++) {
            this.differenceImage[i] = imageOg[i].isEqual(imageDots[i]) ? this.VALUE_EQUAL : this.VALUE_DIFFERENCE;
        }

    }

    private hasRequiredDimension(image: Image): Boolean {
        return image.getHeight() === this.HEIGHT_REQUIRED &&
                image.getWidth() === this.WIDTH_REQUIRED;
    }

}
