import { injectable } from "inversify";
import { BitmapImage } from "../bitmapImage";


const filePath3: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\corners.bmp";
// const filePath4: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\blackTest.bmp";
// const filePath5: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\whiteTest.bmp";

@injectable()
export class GeneratorImageManager {

    private _jimp = require("Jimp");
    private _bitmapImage: BitmapImage;

    public constructor(){
        //default constructor
    }    

    public readFile(){

        let array: number[];

        this._jimp.read(filePath3).then( (image: any) => {
            console.log("corners");
            console.log(image.bitmap.data);
            array = image.bitmap.data;
            array.forEach((element) => {
                console.log(typeof element);
                console.log("value: " + element);
            });
            console.log(image.bitmap.width);
            console.log(image.bitmap.height);
        });
    }



}