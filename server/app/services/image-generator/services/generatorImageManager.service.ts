import { injectable } from "inversify";

// var fs = require('fs');
// var bmp = require("bmp-js");
var Jimp = require('jimp');

@injectable()
export class GeneratorImageManager {

    // private _jimp = require("jimp");

    // private _bmp = require("bmp-js");

    public constructor(){
        //default constructor
    }
    

    public readFile(){

        // const filePath1: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\white.bmp";
        // const filePath2: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\7dots.bmp";
        const filePath3: String  = "C:\\Users\\Thien\\Documents\\Projet_2\\Projet_Integrateur_Log2990\\server\\app\\asset\\image\\testBitmap\\corners.bmp";

        // let bmpbuffer1 = fs.readFileSync(filePath1);
        // let bmpData1 = bmp.decode(bmpbuffer1);

        // let bmpbuffer2 = fs.readFile(filePath2);
        // let bmpData2 = bmp.decode(bmpbuffer2);

        // // const dv: DataView = new DataView(bmpData.data);
        // console.log(bmpData1.data);
        // console.log(bmpData1.width);
        // console.log(bmpData1.height);

        // console.log(bmpData2.data);
        // console.log(bmp.encode(bmpData1));
        // console.log(bmp.encode(bmpData2));
        // console.log(bmpData.colors);
        // console.log(dv);

        let array: any[];

        Jimp.read(filePath3).then( (image: any) => {
            console.log("buffer de image blanc avec dif:");
            console.log(image.bitmap.data);
            array = image.bitmap.data;
            array.forEach((element) => {
                console.log("value: " + element);
            });
        });


    }



}