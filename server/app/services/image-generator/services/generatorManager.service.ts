import { injectable } from "inversify";
import * as Jimp from "jimp";
import { Image } from "../image";
import { Pixel } from "../pixel";


const filePath4: string  =
"C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\white.bmp";
const filePath5: string  =
"C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\7dots.bmp";

@injectable()
export class GeneratorManager {

    private readonly VALUE_DIFFERENCE = 1;
    private readonly VALUE_EQUAL = 0;

    private jimp: Jimp = require("Jimp");
    private imageOriginal: Image;
    private imageWithdots: Image;
    private differenceImage: number[] = [];

    public constructor() {
        // default constructor
    }

    // recieve 2 buffer , return 1 array of number
    public async searchDifferenceImage(): Promise<number[]> {

        await this.readFile(filePath4, filePath5);

        if (this.imageOriginal.hasRequiredDimension() && this.imageWithdots.hasRequiredDimension()) {

            this.findDifference();
            
            return this.differenceImage;

        } else {

            throw new TypeError("Un des images entrees, n'a pas les bonne dimensions");
        }

    }

    private async readFile(path1: string, path2: string): Promise<void> {
        await this.jimp.read(path1).then( (image: Jimp) => {
            this.imageOriginal = this.createImage(
                                    image.bitmap.height,
                                    image.bitmap.width,
                                    image.bitmap.data,
                                );
        });

        await this.jimp.read(path2).then( (image: Jimp) => {
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
            this.differenceImage[i] = imageOg[i].isEqual(imageDots[i])? this.VALUE_EQUAL : this.VALUE_DIFFERENCE;
        }

    }

}
