import * as Axios from "axios";
import { injectable } from "inversify";
import { Cache } from "./cache";
// import Axios, { AxiosInstance } from "axios";

@injectable()
export class HitValidatorService {

    // private axios: Axios.AxiosInstance = require("axios");

    private cache: Cache;
    private readonly CACHE_SIZE: number = 5;

    public constructor() {
        this.cache = new Cache(this.CACHE_SIZE);
        // this.cache.insert( { imageUrl: "url de l'image", buffer: Buffer.from("FUCKING SHIT")});
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

}
