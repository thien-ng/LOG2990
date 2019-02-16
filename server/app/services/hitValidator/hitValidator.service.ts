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
}
