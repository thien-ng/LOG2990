export interface IImageToCache {
    imageUrl:   string;
    buffer:     Buffer;
}

export interface ICacheElement {
    imageToCache: IImageToCache;
    obsolescenceDegree:  number;
}

export interface IHitToValidate {
    posX:               number;
    posY:               number;
    imageUrl:           string;
    colorToIgnore:    number[];
}

export interface IHitConfirmation {
    isAHit:         Boolean;
    hitPixelColor: number[];
}
