import { injectable } from "inversify";
import { Constants } from "../../../constants";

const HEADER_SIZE: number =  54; // size in Bytes

interface JSONBuffer {
    type: string;
    data: Buffer;
}

@injectable()
export class BufferManager {

    public splitHeader(input: Buffer): Buffer[] {

        const dataBuffer: Buffer = this.bufferFromInput(input);

        const header: Buffer = dataBuffer.slice(0, HEADER_SIZE);
        const image: Buffer = dataBuffer.slice(HEADER_SIZE, input.length);

        const buffers: Buffer[] = [];
        buffers.push(header);
        buffers.push(image);

        return buffers;
    }

    private bufferFromInput(input: Buffer): Buffer {

        const jsonBuffer: string = JSON.stringify(input);

        return JSON.parse( jsonBuffer, (key: number, value: JSONBuffer) => {
            const isValidType: boolean = value.type === Constants.BUFFER_TYPE;

            return value && isValidType ? Buffer.from(value.data) : value;
        });
    }

    public arrayToBuffer(array: number[]): Buffer {
        let stringBuffer: string = "";
        array.forEach((element: number) => {
            stringBuffer += element === 0 ? Constants.WHITE_PIXEL :  Constants.BLACK_PIXEL;
        });

        return Buffer.from(stringBuffer, Constants.BUFFER_FORMAT);
    }

    public mergeBuffers(header: Buffer, image: Buffer): Buffer {
        const b: string =  header.toString(Constants.BUFFER_FORMAT) + image.toString(Constants.BUFFER_FORMAT);

        return Buffer.from(b, Constants.BUFFER_FORMAT);
    }

}
