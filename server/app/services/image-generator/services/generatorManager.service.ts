import { injectable } from "inversify";
import * as Jimp from "jimp";
import { Image } from "../image";
import { Pixel } from "../pixel";

// const filePath3: string  =
// "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\corners.bmp";
const filePath4: string  =
"C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\whiteTest.bmp";
const filePath5: string  =
"C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\blackTest.bmp";

@injectable()
export class GeneratorManager {

    private jimp: Jimp = require("Jimp");
    private imageOriginal: Image;
    private imageWithdots: Image;
    private differenceImage: number[] = [];

    public constructor() {
        // default constructor
    }

    public async doAlgo(): Promise<void> {

        await this.readFile();

        if (this.isSameDimension()) {

            const totalDifference: number = this.findDifference();
            console.log(totalDifference);
            console.log(this.differenceImage);
        } else {
            console.log("different mon calisse");
        }
    }

    private async readFile(): Promise<void> {
        await this.jimp.read(filePath4).then( (image: any) => {
            console.log(typeof image);
            const newPixelArray: Pixel[] = this.transformToPixel(image.bitmap.data);
            const height: number = image.bitmap.height;
            const width: number = image.bitmap.width;
            this.imageOriginal = new Image(height, width, newPixelArray);
        });

        await this.jimp.read(filePath5).then( (image: any) => {
            const newPixelArray: Pixel[] = this.transformToPixel(image.bitmap.data);
            const height: number = image.bitmap.height;
            const width: number = image.bitmap.width;
            this.imageWithdots = new Image(height, width, newPixelArray);
        });
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

    private findDifference(): number {

        let differenceCounter: number = 0;

        const imageOg: Pixel[] = this.imageOriginal.getPixelList();
        const imageDots: Pixel[] = this.imageWithdots.getPixelList();

        for (let i: number = 0; i < this.imageOriginal.getPixelList().length; i++) {

            if (imageOg[i].isEqual(imageDots[i])) {
                this.differenceImage[i] = 0;

            } else {
                this.differenceImage[i] = 1;
                differenceCounter++;
            }
        }

        return differenceCounter;
    }

    private isSameDimension(): Boolean {
        return this.imageOriginal.isEqualDimension(this.imageWithdots);
    }

    // to remove
    // private printArray(array: Pixel[]): void {
    //     array.forEach((element: Pixel) => {
    //         console.log(
    //             "red: " + element.getRed() +
    //             " green: " + element.getGreen() +
    //             " blue: " + element.getBlue() +
    //             " alpha: " + element.getAlpha());
    //     });
    // }

}
