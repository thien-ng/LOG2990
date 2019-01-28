import { injectable } from "inversify";
import { Pixel } from "../pixel";


// const filePath3: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\corners.bmp";
const filePath4: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\whiteTest.bmp";
const filePath5: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\blackTest.bmp";

@injectable()
export class GeneratorImageManager {

    private jimp = require("Jimp");
    private originalImage: Pixel[] = [];
    private notOriginalImage: Pixel[] = [];
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

            this.originalImage = this.prepareFile(image.bitmap.data);
        });

        await this.jimp.read(filePath5).then( (image: any) => {

            this.notOriginalImage = this.prepareFile(image.bitmap.data);
        });
    }

    private prepareFile(data: number[]): Pixel[] {

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

        //to remove
        // arrayPixel.forEach((element) => {
        //     console.log(
        //         "red: " + element.getRed() +
        //         " green: " + element.getGreen() + 
        //         " blue: " + element.getBlue() + 
        //         " alpha: " + element.getAlpha());
        // });

        return arrayPixel;
    }

    private findDifference(): number {

        let differenceCounter: number = 0;

        for(let i = 0; i < this.originalImage.length; i++){

            if(this.originalImage[i].isEqual(this.notOriginalImage[i])){
                this.differenceImage[i] = 0;

            }else {
                this.differenceImage[i] = 1;
                differenceCounter++;
            }
        }
        return differenceCounter;
    }



}