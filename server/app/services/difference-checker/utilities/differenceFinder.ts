import { injectable } from "inversify";
import { BMPBuilder } from "./bmpBuilder";
import { Constants } from "./constants";

@injectable()
export class DifferenceFinder {

    private differenceBuffer: Buffer;

    public searchDifferenceImage(originalBuffer: Buffer, modifiedBuffer: Buffer): Buffer {

        if (this.buffersNotEqualSize(originalBuffer, modifiedBuffer)) {
            throw new TypeError(Constants.ERROR_UNEQUAL_DIMENSIONS);
        }

        this.differenceBuffer = this.generateEmpty24BitBuffer(originalBuffer);
        this.findDifference(originalBuffer, modifiedBuffer);

        return this.differenceBuffer;
    }

    private generateEmpty24BitBuffer(buffer: Buffer): Buffer {

        const width:        number      = buffer.readUInt32LE(Constants.WIDTH_OFFSET);
        const height:       number      = buffer.readUInt32LE(Constants.HEIGHT_OFFSET);
        const bmpBuilder:   BMPBuilder  = new BMPBuilder(width, height, Constants.VALUE_EQUAL);
        bmpBuilder.generateBuffer();

        return bmpBuilder.buffer;
    }

    private buffersNotEqualSize(originalBuffer: Buffer, modifiedBuffer: Buffer): Boolean {

        return originalBuffer.length !== modifiedBuffer.length;
    }

    private findDifference(originalBuffer: Buffer, modifiedBuffer: Buffer): void {

        let bufferIndex:    number = Constants.BMP_HEADER_SIZE;
        let assignedValue:  number;
        let areEqual:       Boolean;

        while (bufferIndex < originalBuffer.length) {
            areEqual = this.bufferHasEqualPixel(originalBuffer, modifiedBuffer, bufferIndex);
            assignedValue = areEqual ? Constants.VALUE_EQUAL : Constants.IS_A_DIFFERENCE;

            for (let offset: number = 0; offset < Constants.PIXEL_24B_SIZE; offset++) {
                this.differenceBuffer[bufferIndex + offset] = assignedValue;
            }
            bufferIndex += Constants.PIXEL_24B_SIZE;
        }
    }

    private bufferHasEqualPixel(originalBuffer: Buffer, modifiedBuffer: Buffer, bufferIndex: number): Boolean {

        let isEqual: Boolean = true;

        for (let offset: number = 0; offset < Constants.PIXEL_24B_SIZE && isEqual; offset++) {
            isEqual = originalBuffer[bufferIndex + offset] === modifiedBuffer[bufferIndex + offset];
        }

        return isEqual;
    }
}
