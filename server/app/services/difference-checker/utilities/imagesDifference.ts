import { injectable } from "inversify";

@injectable()
export class ImagesDifference {

    private readonly GREEN_SHIFT: number = 1;
    private readonly BLUE_SHIFT: number = 2;
    private readonly VALUE_NEXT_PIXEL: number = 3;
    private readonly VALUE_DIFFERENCE: number = 1;
    private readonly VALUE_EQUAL: number = 0;
    private readonly ERROR_MESSAGE: string = "Les images ne sont pas de la même taille";
    private differenceImage: number[];

    public constructor() {
        this.differenceImage = [];
    }

    public searchDifferenceImage(originalBuffer: Buffer, differenceBuffer: Buffer): number[] {

        if (this.buffersNotEqualSize(originalBuffer, differenceBuffer)) {
            throw new TypeError(this.ERROR_MESSAGE);
        }

        this.findDifference(originalBuffer, differenceBuffer);

        return this.differenceImage;
    }

    private buffersNotEqualSize(originalBuffer: Buffer, modifiedBuffer: Buffer): Boolean {

        return originalBuffer.length !== modifiedBuffer.length;
    }

    private findDifference(originalBuffer: Buffer, modifiedBuffer: Buffer): void {

        let bufferIndex: number = 0;
        let differenceListIndex: number = 0;
        let assignedValue: number;
        let areEqual: Boolean;

        while (bufferIndex < originalBuffer.length) {
            areEqual = this.bufferHasEqualPixel(originalBuffer, modifiedBuffer, bufferIndex);
            assignedValue = areEqual ? this.VALUE_EQUAL : this.VALUE_DIFFERENCE;

            this.differenceImage[differenceListIndex++] = assignedValue;
            bufferIndex += this.VALUE_NEXT_PIXEL;
        }

    }

    private bufferHasEqualPixel(originalBuffer: Buffer, modifiedBuffer: Buffer, bufferIndex: number): Boolean {
        return originalBuffer[bufferIndex] === modifiedBuffer[bufferIndex] &&
               originalBuffer[bufferIndex + this.GREEN_SHIFT] === modifiedBuffer[bufferIndex + this.GREEN_SHIFT] &&
               originalBuffer[bufferIndex + this.BLUE_SHIFT] === modifiedBuffer[bufferIndex + this.BLUE_SHIFT];
    }

}
