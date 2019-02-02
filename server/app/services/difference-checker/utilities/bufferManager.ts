import { injectable } from "inversify";

const HEADER_SIZE: number =  54; // size in Bytes

@injectable()
export class BufferManager {

    public mergeBuffers(header: Buffer, image: Buffer): Buffer {
        console.log("header");
        console.log(header);

        console.log("image");
        console.log(image);

        const b: string =  header + image.toString("hex");
        // const b: string =  header.toString("hex") + image.toString("hex");

        console.log(Buffer.from(b, "hex"));

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
     
        const jsonBuffer: string = JSON.stringify(input);
        const dataBuffer: Buffer = JSON.parse( jsonBuffer, (key: any, value: any) => {
            return value && value.type === "Buffer" ? Buffer.from(value.data) : value;
        });
        const header: Buffer = dataBuffer.slice(0, HEADER_SIZE);
        const image: Buffer = dataBuffer.slice(HEADER_SIZE, input.length);

        const buffers: Buffer[] = [];
        buffers.push(header);
        buffers.push(image);

        return buffers;

    }

}
