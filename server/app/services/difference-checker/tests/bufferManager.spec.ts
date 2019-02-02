import { expect } from "chai";
import "reflect-metadata";
import { BufferManager } from "../utilities/bufferManager";
import * as fs from "fs";

let bufferManager: BufferManager;

describe("BufferManager tests", () => {

    beforeEach(() => {
        bufferManager = new BufferManager();
    });

    it("should split buffer into 2 parts", (done: Function) => {
        fs.readFile("../../../asset/image/testBitmap/imagetestOg.bmp", (err, data) => {
            console.log(data);
        });
        // const result: Buffer[] = bufferManager.splitHeader(testImage);

        // expect(result.length).to.equal(2);

        done();
    });

    it("should transform number array of number to buffer", (done: Function) => {
            const arrayNumber: number[] = [0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0];
            const result: Buffer = bufferManager.arrayToBuffer(arrayNumber);

            expect(result).instanceOf(Buffer);
    
            done();
    });

    it("should merge 2 buffers", (done: Function) => {
        const strBuff1: string = "ffffff";
        const strBuff2: string = "000000";
        const buffer1: Buffer = Buffer.from(strBuff1, "hex");
        const buffer2: Buffer = Buffer.from(strBuff2, "hex");

        const result: Buffer = bufferManager.mergeBuffers(buffer1, buffer2);

        expect(result).instanceOf(Buffer);

        done();
});

});