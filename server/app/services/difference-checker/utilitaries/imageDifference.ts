import { injectable } from "inversify";
import * as Jimp from "jimp";
import { Image } from "./image";
import { Pixel } from "./pixel";

@injectable()
export class ImageDifference {

    private readonly VALUE_DIFFERENCE: number = 1;
    private readonly VALUE_EQUAL: number = 0;

    private jimp: Jimp = require("Jimp");
    private imageOriginal: Image;
    private imageWithdots: Image;
    private differenceImage: number[] = [];

    public constructor() {
        // default constructor
    }

    public async searchDifferenceImage(originalBuffer: Buffer, differenceBuffer: Buffer): Promise<number[]> {

        await this.readFile(originalBuffer, differenceBuffer);

        if (this.imageOriginal.hasRequiredDimension() && this.imageWithdots.hasRequiredDimension()) {

            this.findDifference();

            return this.differenceImage;

        } else {

            throw new TypeError("Un des images entrees, n'a pas les bonne dimensions");
        }

    }

    private async readFile(originalBuffer: Buffer, differenceBuffer: Buffer): Promise<void> {
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
            const alphaValue: number = data[pixelCounter++];

            const pixel: Pixel = new Pixel(redValue, greenValue, blueValue, alphaValue);
            arrayPixel.push(pixel);
        }

        return arrayPixel;
    }

    private findDifference(): void {

        const imageOg: Pixel[] = this.imageOriginal.getPixelList();
        const imageDots: Pixel[] = this.imageWithdots.getPixelList();

        for (let i: number = 0; i < this.imageOriginal.getPixelList().length; i++) {
            this.differenceImage[i] = imageOg[i].isEqual(imageDots[i]) ? this.VALUE_EQUAL : this.VALUE_DIFFERENCE;
        }

    }

}
