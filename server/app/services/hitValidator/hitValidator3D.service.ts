import { AxiosInstance, AxiosResponse } from "axios";
import { injectable } from "inversify";
import { Cache } from "./cache";
import { IHitConfirmation, IHitToValidate, IImageToCache } from "./interfaces";

@injectable()
export class HitValidatorService3D {

    private readonly ERROR_ON_HTTPGET:      string =
    "Didn't succeed to get scene buffer from URL given.";
    private readonly CACHE_SIZE:            number = 5;

    private cache: Cache;

    public constructor() {
        this.cache = new Cache(this.CACHE_SIZE);
    }

    public async confirmHit(hitToValidate: IHitToValidate): Promise<IHitConfirmation> {

        let buffer: Buffer;

        if (this.isStoredInCache(hitToValidate.differenceDataURL)) {
            buffer = this.cache.get(hitToValidate.differenceDataURL);
        } else {
            buffer = await this.getImageFromUrl(hitToValidate.differenceDataURL);
            this.insertElementInCache(hitToValidate.differenceDataURL, buffer);
        }
        // const colorFound: number = this.findColorAtPoint(hitToValidate.position, buffer);

        // _TODO: A REFAIRE AU COMPLET
        return {
            isAHit:             this.isValidHit(hitToValidate, 1),
            differenceIndex:    3,
        };
    }

}
