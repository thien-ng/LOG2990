import { IPosition2D } from "../../../../common/communication/iGameplay";

export interface IImageToCache {
    imageUrl:               string;
    buffer:                 Buffer;
}

export interface ICacheElement {
    imageToCache:           IImageToCache;
    obsolescenceDegree:     number;
}

export interface IHitToValidate {
    eventInfo:              any;
    differenceDataURL:      string;
    colorToIgnore?:         number;
}

export interface IHitConfirmation {
    isAHit:                 Boolean;
    hitPixelColor:          number[];
}
