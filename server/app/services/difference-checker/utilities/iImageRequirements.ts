export interface IImageRequirements {
    requiredHeight: number;
    requiredWidth:  number;
    requiredNbDiff: number;
    originalImage:  Buffer;
    modifiedImage:  Buffer;
}
