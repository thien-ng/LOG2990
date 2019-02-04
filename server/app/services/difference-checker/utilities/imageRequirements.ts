export interface ImageRequirements {
    requiredHeight: number;
    requiredWidth: number;
    requiredNbDiff: number;
    originalImage: Buffer;
    modifiedImage: Buffer;
}
