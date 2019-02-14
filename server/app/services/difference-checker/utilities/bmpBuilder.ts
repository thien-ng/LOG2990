export class BMPBuilder {

    private readonly BASE_HEADER_SIZE: number = 14;
    private readonly INFOHEADER_SIZE: number = 40;

    private readonly HEADER_SIGNATURE: number = 0x424D; // BM in ascii
    private readonly HEADER_RESERVED: number = 0;       // unused => 0
    private readonly HEADER_DATAOFFSET: number = 54;
    private readonly PLANES: number  = 1;
    private readonly COMPRESSION: number  = 0;
    private readonly HORIZONTAL_RESOLUTION: number  = 2835;
    private readonly VERTICAL_RESOLUTION: number  = 2835;
    private readonly COLOR_USED: number  = 0;
    private readonly IMPORTANT_COLOR_USED: number  = 0;

    private readonly BYTE_SPAN_2: number = 2;
    private readonly BYTE_SPAN_4: number = 4;
    private readonly BITDEPTH_24: number = 24;
    private readonly NUM_BITS_IN_BYTE: number = 8;
    private readonly BASE_HEXA: number = 16;

    private readonly BLUE_OFFSET:  number = 0;
    private readonly GREEN_OFFSET: number = 1;
    private readonly RED_OFFSET:   number = 2;
    private readonly MIN_ENTRY: number  = 0;
    private readonly MAX_ENTRY: number  = 255;

    private buffer: Buffer;

    public constructor(
        private width: number,
        private height: number,
        private fillWith: number = 0,
    ) {

        this.validateDimensions();
        this.validateFillEntry();
        // this.buffer = this.buildBuffer();
    }

    private validateDimensions(): void {
        if (this.width < 0) {
            throw new RangeError("Invalid width entered. Width must be a positive number.");
        }
        if (this.height < 0) {
            throw new RangeError("Invalid height entered. Height must be a positive number.");
        }
    }

    private validateFillEntry(): void {
        if (this.fillWith < this.MIN_ENTRY || this.fillWith > this.MAX_ENTRY) {
            throw new RangeError("Invalid fill number entered. Must be comprised between 0 and 255 inclusively.");
        }
    }
    private buildBuffer(): Buffer {
        const header: Buffer = this.buildFullHeader();
        const totalPaddingSize: number = this.paddingPerRow() * this.height;
        const numOfBytesInBody: number = this.width * this.height *  this.getBitDepthInBytes() + totalPaddingSize;
        const body: Buffer = Buffer.allocUnsafe(numOfBytesInBody).fill(this.fillWith);

        const totalSize: number = header.length + body.length;

        return Buffer.concat([header, body], totalSize);
    }

    private buildFullHeader(): Buffer {
        const baseHeader: Buffer = this.buildBaseHeader();
        const infoHeader: Buffer = this.buildInfoHeader();
        const bufferArray: Buffer[] = [
            baseHeader,
            infoHeader,
        ];

        return Buffer.concat(bufferArray, this.HEADER_DATAOFFSET);
    }

    private buildBaseHeader(): Buffer {
        const signature:    Buffer = Buffer.from(this.HEADER_SIGNATURE.toString(this.BASE_HEXA), "hex");
        const fileSize:     Buffer = Buffer.from(this.spanNumberOnNBytes(this.getFileSize(),        this.BYTE_SPAN_4));
        const reserved:     Buffer = Buffer.from(this.spanNumberOnNBytes(this.HEADER_RESERVED,      this.BYTE_SPAN_4));
        const dataOffset:   Buffer = Buffer.from(this.spanNumberOnNBytes(this.HEADER_DATAOFFSET,    this.BYTE_SPAN_4));

        const bufferArray: Buffer[] = [
            signature,
            fileSize,
            reserved,
            dataOffset,
        ];

        return Buffer.concat(bufferArray, this.BASE_HEADER_SIZE);
    }

    private buildInfoHeader(): Buffer {
        const size:         Buffer = Buffer.from(this.spanNumberOnNBytes(this.INFOHEADER_SIZE,       this.BYTE_SPAN_4));
        const width:        Buffer = Buffer.from(this.spanNumberOnNBytes(this.width,                 this.BYTE_SPAN_4));
        const height:       Buffer = Buffer.from(this.spanNumberOnNBytes(this.height,                this.BYTE_SPAN_4));
        const planes:       Buffer = Buffer.from(this.spanNumberOnNBytes(this.PLANES,                this.BYTE_SPAN_2));
        const bitDepth:     Buffer = Buffer.from(this.spanNumberOnNBytes(this.BITDEPTH_24,              this.BYTE_SPAN_2));
        const compression:  Buffer = Buffer.from(this.spanNumberOnNBytes(this.COMPRESSION,           this.BYTE_SPAN_4));
        const imageSize:    Buffer = Buffer.from(this.spanNumberOnNBytes(this.width * this.height,   this.BYTE_SPAN_4));
        const horizRes:     Buffer = Buffer.from(this.spanNumberOnNBytes(this.HORIZONTAL_RESOLUTION, this.BYTE_SPAN_4));
        const vertiRes:     Buffer = Buffer.from(this.spanNumberOnNBytes(this.VERTICAL_RESOLUTION,   this.BYTE_SPAN_4));
        const color:        Buffer = Buffer.from(this.spanNumberOnNBytes(this.COLOR_USED,            this.BYTE_SPAN_4));
        const impColor:     Buffer = Buffer.from(this.spanNumberOnNBytes(this.IMPORTANT_COLOR_USED,  this.BYTE_SPAN_4));

        const infoHeaderArray: Buffer[] = [
            size,
            width,
            height,
            planes,
            bitDepth,
            compression,
            imageSize,
            horizRes,
            vertiRes,
            color,
            impColor,
        ];

        return Buffer.concat(infoHeaderArray, this.INFOHEADER_SIZE);
    }

    private getBitDepthInBytes(): number {
        return Math.ceil(this.BITDEPTH_24 / this.NUM_BITS_IN_BYTE);
    }

    private paddingPerRow(): number {
        return this.BYTE_SPAN_4 - (this.width * this.getBitDepthInBytes()) % this.BYTE_SPAN_4;
    }

    private getFileSize(): number {
        return this.width * this.height * this.getBitDepthInBytes() + this.HEADER_DATAOFFSET;
    }

    private spanNumberOnNBytes(num: number, spanRange: number): Buffer {
        const spannedBuffer: Buffer = Buffer.allocUnsafe(spanRange);
        const byteNumericalSpan: number = 256;
        for (let i: number = 0; i < spanRange; i++) {
            const value: number = num % byteNumericalSpan;
            spannedBuffer[i] = value;
            num = Math.floor(num / byteNumericalSpan);
        }

        return spannedBuffer;
    }

    private set24BitCol(R: number, G: number, B: number, startPos: number): void {
        this.buffer[startPos + this.BLUE_OFFSET ] = B;
        this.buffer[startPos + this.GREEN_OFFSET] = G;
        this.buffer[startPos + this.RED_OFFSET  ] = R;
    }
}
