export interface IImageToCache {
    imageUrl:   string;
    buffer:     Buffer;
}

export interface ICacheElement {
    imageToCache: IImageToCache;
    hitsSinceLastAccess: 0;
}
