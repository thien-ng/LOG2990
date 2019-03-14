import * as fs from "fs";
import { Constants } from "../constants";

const IMAGES_PATH:              string = "./app/asset/image";
const FILE_GENERATION_ERROR:    string = "error while generating file";
const FILE_DELETION_ERROR:      string = "error while deleting file";
const FILE_SAVING_ERROR:        string = "error while saving file";

export class AssetManagerService {

    public createBMP(buffer: Buffer, cardId: number): number {

        const path: string = IMAGES_PATH + "/" + cardId + Constants.GENERATED_FILE;
        this.stockImage(path, buffer);

        return cardId;
    }

    public stockImage(path: string, buffer: Buffer): void {
        try {
            fs.writeFileSync(path, Buffer.from(buffer));
        } catch (error) {
            throw TypeError(FILE_GENERATION_ERROR);
        }
    }

    public deleteStoredImages(paths: string[]): void {
        paths.forEach((path: string) => {
           try {
            fs.unlinkSync(path);
           } catch (error) {
               throw TypeError(FILE_DELETION_ERROR);
           }
        });
    }

    public saveImage(path: string, image: string): void {

        const base64Image: string | undefined = image.split(";base64,").pop();
        try {
            fs.writeFileSync(path, base64Image, {encoding: "base64"});
        } catch (error) {
            throw TypeError(FILE_GENERATION_ERROR);
        }
    }

    public saveGeneratedScene(path: string, data: string): void {
        try {
            fs.writeFileSync(path, data);
        } catch (error) {
            throw TypeError(FILE_SAVING_ERROR);
        }
    }

    public copyFileToTemp(sourcePath: string, gameId: number, type: string): void {
        const imgPathTemp: string = Constants.PATH_LOCAL_TEMP + gameId + type;
        try {
            fs.copyFileSync(sourcePath, imgPathTemp);
        } catch (error) {
            throw new TypeError(FILE_GENERATION_ERROR);
        }
    }

    public deleteFileInTemp(gameId: number, type: string): void {
        const imgPathTemp: string = Constants.PATH_LOCAL_TEMP + gameId + type;
        try {
            fs.unlinkSync(imgPathTemp);
        } catch (error) {
            throw new TypeError(FILE_DELETION_ERROR);
        }
    }
}
