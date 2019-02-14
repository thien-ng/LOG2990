import { injectable } from "inversify";
import { Constants } from "../../../constants";
import { BMPBuilder } from "./bmpBuilder";

@injectable()
export class ImagesDifference {

    private readonly RED_SHIFT:         number = 0;
    private readonly GREEN_SHIFT:       number = 1;
    private readonly BLUE_SHIFT:        number = 2;
    private readonly VALUE_NEXT_PIXEL:  number = 3;
    private readonly VALUE_DIFFERENCE:  number = 1;
    private readonly VALUE_EQUAL:       number = 0;
    private readonly HEADER_SIZE:       number = 54;

    private readonly WIDTH_OFFSET:      number = 18;
    private readonly HEIGHT_OFFSET:     number = 22;

    private differenceBuffer: Buffer;

    public constructor() { /* */ }

    public searchDifferenceImage(originalBuffer: Buffer, modifiedBuffer: Buffer): Buffer {

        if (this.buffersNotEqualSize(originalBuffer, modifiedBuffer)) {
            throw new TypeError(Constants.ERROR_UNEQUAL_DIMENSIONS);
        }

        this.differenceBuffer = this.generateEmpty24BitBuffer(originalBuffer);
        this.findDifference(originalBuffer, modifiedBuffer);

        return this.differenceBuffer;
    }

    private generateEmpty24BitBuffer(buffer: Buffer): Buffer {

        const width: number = buffer.readUInt32LE(this.WIDTH_OFFSET);
        const height: number = buffer.readUInt32LE(this.HEIGHT_OFFSET);
        const bmpBuilder: BMPBuilder = new BMPBuilder(width, height, this.VALUE_EQUAL);

        return bmpBuilder.buffer;
    }

    private buffersNotEqualSize(originalBuffer: Buffer, modifiedBuffer: Buffer): Boolean {

        return originalBuffer.length !== modifiedBuffer.length;
    }

    private findDifference(originalBuffer: Buffer, modifiedBuffer: Buffer): void {

        let bufferIndex: number = this.HEADER_SIZE;
        // let differenceListIndex: number = 0;
        let assignedValue: number;
        let areEqual: Boolean;

        while (bufferIndex < originalBuffer.length) {
            areEqual = this.bufferHasEqualPixel(originalBuffer, modifiedBuffer, bufferIndex);
            assignedValue = areEqual ? this.VALUE_EQUAL : this.VALUE_DIFFERENCE;

            for (let offset: number = 0; offset < this.VALUE_NEXT_PIXEL; offset++) {
                this.differenceBuffer[bufferIndex + offset] = assignedValue;
            }
            bufferIndex += this.VALUE_NEXT_PIXEL;
        }
    }

    private bufferHasEqualPixel(originalBuffer: Buffer, modifiedBuffer: Buffer, bufferIndex: number): Boolean {
        return originalBuffer[bufferIndex] === modifiedBuffer[bufferIndex] &&
               originalBuffer[bufferIndex + this.GREEN_SHIFT] === modifiedBuffer[bufferIndex + this.GREEN_SHIFT] &&
               originalBuffer[bufferIndex + this.BLUE_SHIFT] === modifiedBuffer[bufferIndex + this.BLUE_SHIFT];
    }

}
