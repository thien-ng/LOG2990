import { AxiosInstance, AxiosResponse } from "axios";
import { injectable } from "inversify";
import { IPosition2D } from "../../../../common/communication/iGameplay";
import { Cache } from "./cache";
import { IHitConfirmation, IHitToValidate, IImageToCache } from "./interfaces";

@injectable()
export class HitValidatorService2D {

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

    public async confirmHit(hitToValidate: IHitToValidate<IPosition2D>): Promise<IHitConfirmation> {

        let buffer: Buffer;

        if (this.isStoredInCache(hitToValidate.differenceDataURL)) {
            buffer = this.cache.get(hitToValidate.differenceDataURL);
        } else {
            buffer = await this.getImageFromUrl(hitToValidate.differenceDataURL);
            this.insertElementInCache(hitToValidate.differenceDataURL, buffer);
        }
        const colorFound: number = this.findColorAtPoint(hitToValidate.eventInfo, buffer);

        return {
            isAHit:             this.isValidHit(hitToValidate, colorFound),
            differenceIndex:    colorFound,
        };
    }

    private isValidHit(hitToValidate: IHitToValidate<IPosition2D>, hitPixelColor: number): boolean {
        return hitToValidate.colorToIgnore !== hitPixelColor;
    }

    private findColorAtPoint(position: IPosition2D, buffer: Buffer): number {

        const reversedY:        number      = (this.getImageHeight(buffer) - 1) - position.y;
        const offsetX:          number      = position.x * this.BUFFER_24BIT_SIZE;
        const offsetY:          number      = reversedY * this.getImageWidth(buffer) * this.BUFFER_24BIT_SIZE;

        return buffer[offsetX + offsetY + this.BUFFER_HEADER_SIZE];
    }

    private async getImageFromUrl(imageUrl: string): Promise<Buffer> {

        const axios: AxiosInstance = require("axios");

        return axios
            .get(imageUrl, {
                responseType: "arraybuffer",
            })
            .then((response: AxiosResponse) => Buffer.from(response.data, "binary"))
            .catch((error: Error) => {
                throw new TypeError(this.ERROR_ON_HTTPGET);
            });
    }

    private getImageWidth(buffer: Buffer): number {
        return buffer.readInt32LE(this.BUFFER_OFFSET_WIDTH);
    }

    private getImageHeight(buffer: Buffer): number {
        return buffer.readInt32LE(this.BUFFER_OFFSET_HEIGHT);
    }

    private insertElementInCache(imageUrl: string, buffer: Buffer): void {
        const newCacheElement: IImageToCache = {
            imageUrl:   imageUrl,
            buffer:     buffer,
        };
        this.cache.insert(newCacheElement);
    }

    private isStoredInCache(imageUrl: string): boolean {
        return this.cache.contains(imageUrl);
    }
}
