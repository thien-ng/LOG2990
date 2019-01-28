import { injectable } from "inversify";
import { Pixel } from "../pixel";


const filePath3: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\corners.bmp";
// const filePath4: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\blackTest.bmp";
// const filePath5: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\whiteTest.bmp";

@injectable()
export class GeneratorImageManager {

    private _jimp = require("Jimp");
    private _originalImage: Pixel[] = [];
    private _7DifferentImage: Pixel[] = [];


    public constructor(){
        //default constructor
    }

    public doAlgo() {
        this.readFile();
    }

    private readFile(): void{

        this._jimp.read(filePath3).then( (image: any) => {

            this._originalImage = this.prepareFile(image.bitmap.data);
        });

        this._jimp.read(filePath3).then( (image: any) => {

            this._7DifferentImage = this.prepareFile(image.bitmap.data);
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

    private findDifference(): Pixel[] {
        let newPixelArray: Pixel[] = [];

        for(let i = 0; i < this._originalImage.length; i++){

            if(this._originalImage[i].isEqual(this._7DifferentImage[i])){
                newPixelArray[i] = this._originalImage[i];

            }else {
                newPixelArray[i] = new Pixel(0,0,0,0);
            }
        }
        
        return newPixelArray;
    }



}