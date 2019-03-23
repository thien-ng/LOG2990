import * as fs from "fs";
import { injectable } from "inversify";
import { CCommon } from "../../../common/constantes/cCommon";
import { ITheme } from "../../../common/communication/ITheme"; 
import { Constants } from "../constants";

const IMAGES_PATH:              string = "./app/asset/image";
const FILE_GENERATION_ERROR:    string = "error while generating file";
const FILE_DELETION_ERROR:      string = "error while deleting file";
const FILE_SAVING_ERROR:        string = "error while saving file";
const TEMP_ROUTINE_ERROR:       string = "error while copying to temp";
const GET_THEME_ERROR:          string = "error while getting theme file";

@injectable()
export class AssetManagerService {
    private countByGameId: Map<number, number>;

    public constructor() {
        this.countByGameId = new Map<number, number>();
    }

    public createBMP(buffer: Buffer, gameID: number): number {

        const path: string = IMAGES_PATH + "/" + gameID + Constants.GENERATED_FILE;
        this.stockImage(path, buffer);

        return gameID;
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

    public tempRoutine2d(gameId: number): void {
        const pathOriginal:  string = Constants.IMAGES_PATH + "/" + gameId + CCommon.ORIGINAL_FILE;
        const pathGenerated: string = Constants.IMAGES_PATH + "/" + gameId + Constants.GENERATED_FILE;
        try {
            this.copyFileToTemp(pathGenerated, gameId, Constants.GENERATED_FILE);
            this.copyFileToTemp(pathOriginal, gameId, CCommon.ORIGINAL_FILE);
            this.manageCounter(gameId);
        } catch (error) {
            throw new TypeError(TEMP_ROUTINE_ERROR);
        }
    }

    public tempRoutine3d(gameId: number): void {
        const path: string = Constants.SCENE_PATH + "/" + gameId + CCommon.SCENE_FILE;
        try {
            this.copyFileToTemp(path, gameId, CCommon.SCENE_FILE);
            this.manageCounter(gameId);
        } catch (error) {
            throw new TypeError(TEMP_ROUTINE_ERROR);
        }
    }

    private manageCounter(gameId: number): void {
        const aliveArenaCount: number | undefined =  this.countByGameId.get(gameId);
        if (aliveArenaCount !== undefined) {
            this.countByGameId.set(gameId, aliveArenaCount + 1);
        } else {
            this.countByGameId.set(gameId, 1);
        }
    }

    public decrementTempCounter(gameID: number, aliveArenaCount: number): void {
        this.countByGameId.set(gameID, aliveArenaCount - 1);
    }

    public getCounter(gameID: number): number | undefined {
        return this.countByGameId.get(gameID);
    }

    public saveGeneratedScene(path: string, data: string): void {
        try {
            fs.writeFileSync(path, data);
        } catch (error) {
            console.log(error.message);
            throw TypeError(FILE_SAVING_ERROR);
        }
    }

    private copyFileToTemp(sourcePath: string, gameId: number, type: string): void {
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

    public getTheme(themeName: string): ITheme {
        const themePath: string = Constants.PATH_LOCAL_THEME + themeName;
        try {
            const readFile: Buffer = fs.readFileSync(themePath);
            return JSON.parse(readFile.toString()) as ITheme;
        } catch (error) {
            throw new TypeError(GET_THEME_ERROR);
        }
    }
}
