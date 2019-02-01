import { injectable } from "inversify";

const HEADER_SIZE: number =  54; // size in Bytes

@injectable()
export class BufferManager {

    public mergeBuffers(header: Buffer, image: Buffer): Buffer {
        const b: string =  header.toString("hex") + image.toString("hex");

        return Buffer.from(b, "hex");
    }

    public arrayToBuffer(array: number[]): Buffer {
        let stringBuffer: string = "";
        array.forEach((element: number) => {
            if (element === 0) {
                stringBuffer += "000000";
            } else {
                stringBuffer += "ffffff";
            }
        });

        return Buffer.from(stringBuffer, "hex");
    }

    public splitHeader(input: Buffer): Buffer[] {
        const header: Buffer = input.slice(0, HEADER_SIZE);
        const image: Buffer = input.slice(HEADER_SIZE, input.length);

        const buffers: Buffer[] = [];
        buffers.push(header);
        buffers.push(image);

        return buffers;

    }

}
