import { injectable } from "inversify";
// import { BitmapImage } from "../bitmapImage";


const filePath3: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\corners.bmp";
// const filePath4: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\blackTest.bmp";
// const filePath5: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\whiteTest.bmp";

@injectable()
export class GeneratorImageManager {

    private _jimp = require("Jimp");
    // private _bitmapImage: BitmapImage;

    public constructor(){
        //default constructor
    }

    public readFile(): void{

        // let array: number[];

        this._jimp.read(filePath3).then( (image: any) => {
            // this._bitmapImage = {
            //     width: image.bitmap.width,
            //     height: image.bitmap.height,
            //     data: image.bitmap.data,
            // };

            this.prepareFile(
                image.bitmap.width,
                image.bitmap.height,
                image.bitmap.data,
                );
        });
    }

    private prepareFile(widht: number, height: number, data: number[]): void {

        // console.log(widht);
        // console.log(height);
        // console.log(data);
        // data.forEach((element) => {
        //     console.log(element);
        // });

    }



}