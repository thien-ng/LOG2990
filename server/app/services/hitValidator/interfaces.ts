export interface IImageToCache {
    imageUrl:               string;
    buffer:                 Buffer;
}

export interface ICacheElement {
    imageToCache:           IImageToCache;
    obsolescenceDegree:     number;
}

export interface IHitToValidate<EVT_T> {
    eventInfo:              EVT_T;
    differenceDataURL:      string;
    colorToIgnore?:         number;
}

export interface IHitConfirmation {
    isAHit:                 Boolean;
    differenceIndex:        number;
}
