import { AxiosInstance, AxiosResponse } from "axios";
import { injectable } from "inversify";
import { ISceneVariablesMessage } from "../../../../common/communication/iSceneVariables";
import { Cache } from "./cache";
import { IDataToCache, IHitConfirmation, IHitToValidate } from "./interfaces";

@injectable()
export class HitValidatorService3D {

    private readonly ERROR_ON_HTTPGET:      string =
    "Didn't succeed to get scene buffer from URL given.";
    private readonly CACHE_SIZE:            number = 5;

    private cache: Cache<ISceneVariablesMessage>;

    public constructor() {
        this.cache = new Cache<ISceneVariablesMessage>(this.CACHE_SIZE);
    }

    // public async confirmHit(hitToValidate: IHitToValidate<>): Promise<IHitConfirmation> {

    //     let buffer: Buffer;

    //     if (this.isStoredInCache(hitToValidate.differenceDataURL)) {
    //         buffer = this.cache.get(hitToValidate.differenceDataURL);
    //     } else {
    //         buffer = await this.getImageFromUrl(hitToValidate.differenceDataURL);
    //         this.insertElementInCache(hitToValidate.differenceDataURL, buffer);
    //     }

    //     // _TODO: A REFAIRE AU COMPLET
    //     return {
    //         isAHit:             this.isValidHit(hitToValidate, 1),
    //         differenceIndex:    3,
    //     };
    // }

    // private isValidHit(hitToValidate: IHitToValidate, hitPixelColor: number): boolean {
    //     return hitToValidate.colorToIgnore !== hitPixelColor;
    // }

    // private async getImageFromUrl(imageUrl: string): Promise<Buffer> {

    //     const axios: AxiosInstance = require("axios");

    //     return axios
    //         .get(imageUrl, {
    //             responseType: "arraybuffer",
    //         })
    //         .then((response: AxiosResponse) => Buffer.from(response.data, "binary"))
    //         .catch((error: Error) => {
    //             throw new TypeError(this.ERROR_ON_HTTPGET);
    //         });
    // }

    // private insertElementInCache(imageUrl: string, buffer: Buffer): void {
    //     const newCacheElement: IImageToCache = {
    //         imageUrl:   imageUrl,
    //         buffer:     buffer,
    //     };
    //     this.cache.insert(newCacheElement);
    // }

    // private isStoredInCache(imageUrl: string): boolean {
    //     return this.cache.contains(imageUrl);
    // }
}
