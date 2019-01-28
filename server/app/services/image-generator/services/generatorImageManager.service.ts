import { injectable } from "inversify";
import { Pixel } from "../pixel";


const filePath3: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\corners.bmp";
// const filePath4: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\blackTest.bmp";
// const filePath5: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\whiteTest.bmp";

@injectable()
export class GeneratorImageManager {

    private _jimp = require("Jimp");

    public constructor(){
        //default constructor
    }

    public doAlgo() {
        this.readFile(filePath3);
    }

    public readFile(path: String): void{

        // let array: number[];

        this._jimp.read(path).then( (image: any) => {

            this.prepareFile(image.bitmap.data);
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

        arrayPixel.forEach((element) => {
            console.log(
                "red: " + element.getRed() +
                " green: " + element.getGreen() + 
                " blue: " + element.getBlue() + 
                " alpha: " + element.getAlpha());
        });

        return arrayPixel;
    }



}