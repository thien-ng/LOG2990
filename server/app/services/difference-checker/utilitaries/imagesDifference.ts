import { injectable } from "inversify";

@injectable()
export class ImagesDifference {

    private readonly VALUE_DIFFERENCE: number = 1;
    private readonly VALUE_EQUAL: number = 0;
    private readonly ERROR_MESSAGE = "size of buffers are not equal";
    private differenceImage: number[];

    public constructor() {
        this.differenceImage = [];
    }

    public searchDifferenceImage(originalBuffer: Buffer, differenceBuffer: Buffer): number[] {

        if (this.isBuffersEqualSize(originalBuffer, differenceBuffer)) {
            throw new TypeError(this.ERROR_MESSAGE);
        }

        this.findDifference(originalBuffer, differenceBuffer);
        
        return this.differenceImage;
    }

    private isBuffersEqualSize(originalBuffer: Buffer, modifiedBuffer: Buffer): Boolean {

        return originalBuffer.byteLength === modifiedBuffer.byteLength;
    }

    private findDifference(originalBuffer: Buffer, modifiedBuffer: Buffer): void {

        let bufferIndex: number = 0
        let diffenceListIndex: number = 0;
        while (bufferIndex < originalBuffer.byteLength) {

            if (originalBuffer[bufferIndex] === modifiedBuffer[bufferIndex++] &&
                originalBuffer[bufferIndex] === modifiedBuffer[bufferIndex++] &&
                originalBuffer[bufferIndex] === modifiedBuffer[bufferIndex++] ) {

                this.differenceImage[diffenceListIndex++] = this.VALUE_EQUAL;

            } else {

                this.differenceImage[diffenceListIndex++] = this.VALUE_DIFFERENCE;
            }
        }

    }

}
