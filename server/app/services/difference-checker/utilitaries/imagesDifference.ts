import { injectable } from "inversify";

@injectable()
export class ImagesDifference {

    private readonly GREEN_SHIFT = 1;
    private readonly BLUE_SHIFT = 2;
    private readonly VALUE_NEXT_PIXEL = 3;
    private readonly VALUE_DIFFERENCE: number = 1;
    private readonly VALUE_EQUAL: number = 0;
    private readonly ERROR_MESSAGE = "size of buffers are not equal";
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

        return originalBuffer.byteLength !== modifiedBuffer.byteLength;
    }

    private findDifference(originalBuffer: Buffer, modifiedBuffer: Buffer): void {

        let bufferIndex: number = 0
        let differenceListIndex: number = 0;
        while (bufferIndex < originalBuffer.byteLength) {

            if (originalBuffer[bufferIndex] === modifiedBuffer[bufferIndex] &&
                originalBuffer[bufferIndex + this.GREEN_SHIFT] === modifiedBuffer[bufferIndex + + this.GREEN_SHIFT] &&
                originalBuffer[bufferIndex + this.BLUE_SHIFT] === modifiedBuffer[bufferIndex + this.BLUE_SHIFT] ) {

                this.differenceImage[differenceListIndex++] = this.VALUE_EQUAL;

            } else {

                this.differenceImage[differenceListIndex++] = this.VALUE_DIFFERENCE;
            }
            bufferIndex += this.VALUE_NEXT_PIXEL;
        }

    }

}
