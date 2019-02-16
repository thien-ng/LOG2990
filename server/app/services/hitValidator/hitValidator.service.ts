import { AxiosInstance, AxiosResponse } from "axios";
import { injectable } from "inversify";
import { Cache } from "./cache";
import { IHitConfirmation, IHitToValidate, IImageToCache } from "./interfaces";

@injectable()
export class HitValidatorService {

    private readonly ERROR_ON_HTTPGET:      string =
    "Didn't succeed to get image buffer from URL given. File: hitValidator.service.ts. Line: 64.";
    private readonly BUFFER_OFFSET_WIDTH:   number = 18;
    private readonly BUFFER_OFFSET_HEIGHT:  number = 22;
    private readonly BUFFER_HEADER_SIZE:    number = 54;
    private readonly BUFFER_24BIT_SIZE:     number = 3;
    private readonly CACHE_SIZE:            number = 5;

    private cache: Cache;

    public constructor() {
        this.cache = new Cache(this.CACHE_SIZE);
    }

    public async confirmHit(posX: number, posY: number, imageUrl: string): Promise<number> {

        if (!this.isStoredInCache(imageUrl)) {
            this.cacheImageFromUrl(imageUrl);
        }
        const buffer: Buffer | undefined = this.cache.get(imageUrl);
        // console.log("buffer apres lavoir mis dans la cache : " + buffer);

        return buffer ? this.findColorAtPoint(posX, posY, buffer) : -1;

    }

    private findColorAtPoint(posX: number, posY: number, buffer: Buffer): number {

        // console.log();
        const trueX: number = posX;
        const imageWidth: number = 640;
        const imageHeight: number = 640;
        const trueY: number = imageHeight - posY;
        const headerSize: number = 54;
        const pixelSize: number = 3;
        const absolutePosition: number = trueX * pixelSize + trueY * imageWidth * pixelSize + headerSize;
        // console.log("absolutePosition " + absolutePosition );
        // console.log("buffer lenght " + buffer.length );

        return buffer[absolutePosition];
    }

    private isStoredInCache(imageUrl: string): boolean {
        return this.cache.contains(imageUrl);
    }

    private cacheImageFromUrl(imageUrl: string): void {

        // let buffer: Buffer = Buffer.from("FUCK");

        const axios: Axios.AxiosInstance = require("axios");

        axios.get(imageUrl)
        .then( (response: Axios.AxiosResponse<Buffer>) => {
             return response.data;
        })
        .then(async (buffer: Buffer) => {
            this.cache.insert({ imageUrl: imageUrl, buffer: buffer });

            return buffer;
        })
        .catch((error: Error) => {
            // console.log(error);
        });

        // return buffer;
    }

}
