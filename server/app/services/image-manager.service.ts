import * as fs from "fs";

const IMAGES_PATH: string = "./app/asset/image";
const FILE_GENERATION_ERROR: string = "error while generating file";
const FILE_DELETION_ERROR: string = "error while deleting file";

export class ImageManagerService {

    public createBMP(buffer: Buffer, cardId: number): number {

        const path: string = IMAGES_PATH + "/" + cardId + "_generated.bmp";

        this.stockImage(path, buffer);

        return cardId;
    }

    public stockImage(path: string, buffer: Buffer): void {
        fs.writeFile(path, Buffer.from(buffer), (error: Error) => {
            if (error) {
                throw TypeError(FILE_GENERATION_ERROR);
            }
        });
    }

    public deleteStoredImages(paths: string[]): void {
        paths.forEach((path: string) => {
            fs.unlink(path, (error: Error) => {
                if (error) {
                    throw TypeError(FILE_DELETION_ERROR);
                }
            });
        });
    }
}
