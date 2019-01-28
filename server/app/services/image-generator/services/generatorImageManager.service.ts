import { injectable } from "inversify";
import { Image } from "../image";
import { Pixel } from "../pixel";
import * as Jimp from "jimp";


// const filePath3: string  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\corners.bmp";
const filePath4: string  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\whiteTest.bmp";
const filePath5: string  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\blackTest.bmp";

@injectable()
export class GeneratorImageManager {

    private jimp: Jimp = require("Jimp");
    private imageOriginal: Image;
    private imageWithdots: Image;
    private differenceImage: number[] = [];


    public constructor(){
        //default constructor
    }

    public async doAlgo() {

        await this.readFile();

        let totalDifference: number = this.findDifference();
        console.log(totalDifference);
        console.log(this.differenceImage);
    }

    private async readFile(): Promise<void>{
        await this.jimp.read(filePath4).then( (image: any) => {
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

    private transformToPixel(data: number[]): Pixel[] { //RGBA

        let arrayPixel: Pixel[] = [];

        let pixelCounter: number = 0;
        while(pixelCounter < data.length) {
            let redValue = data[pixelCounter++];
            let greenValue = data[pixelCounter++];
            let blueValue = data[pixelCounter++];
            let alphaValue = data[pixelCounter++]

            let pixel: Pixel = new Pixel(redValue, greenValue, blueValue, alphaValue);
            arrayPixel.push(pixel);
        }

        return arrayPixel;
    }

    //array[width * row + col] = value
    private findDifference(): number {

        let differenceCounter: number = 0;

        const imageOg = this.imageOriginal.getPixelList();
        const imageDots = this.imageWithdots.getPixelList();

        for(let i = 0; i < this.imageOriginal.getPixelList().length; i++){

            if(imageOg[i].isEqual(imageDots[i])){
                this.differenceImage[i] = 0;

            }else {
                this.differenceImage[i] = 1;
                differenceCounter++;
            }
        }

        return differenceCounter;
    }

    private isNextToPixel(): Boolean {

        //if en haut, if en bas, if a droite, if a gauche

        //if en diagonal 


        return true;
    }

    //to remove
    private printArray(array: Pixel[]){
        array.forEach((element) => {
            console.log(
                "red: " + element.getRed() +
                " green: " + element.getGreen() + 
                " blue: " + element.getBlue() + 
                " alpha: " + element.getAlpha());
        });
    }

}