import { injectable } from "inversify";
import { Constants } from "../../../constants";

@injectable()
export class ImagesDifference {

    private readonly GREEN_SHIFT: number = 1;
    private readonly BLUE_SHIFT: number = 2;
    private readonly VALUE_NEXT_PIXEL: number = 3;
    private readonly VALUE_DIFFERENCE: number = 1;
    private readonly VALUE_EQUAL: number = 0;
    private differenceImage: number[];
    private readonly HEADER_SIZE: number = 54;

    public constructor() {
        this.differenceImage = [];
    }

    public searchDifferenceImage(originalBuffer: Buffer, differenceBuffer: Buffer): number[] {

        if (this.buffersNotEqualSize(originalBuffer, differenceBuffer)) {
            throw new TypeError(Constants.ERROR_UNEQUAL_DIMENSIONS);
        }

        this.findDifference(originalBuffer, differenceBuffer);

        return this.differenceImage;
    }

    private buffersNotEqualSize(originalBuffer: Buffer, modifiedBuffer: Buffer): Boolean {

        return originalBuffer.length !== modifiedBuffer.length;
    }

    private findDifference(originalBuffer: Buffer, modifiedBuffer: Buffer): void {

        let bufferIndex: number = this.HEADER_SIZE;
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
