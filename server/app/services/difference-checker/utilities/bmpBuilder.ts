export class BMPBuilder {

    private readonly HEADER_SIGNATURE: number = 0x424D; // BM in ascii
    private readonly HEADER_RESERVED: number = 0;       // unused => 0
    private readonly HEADER_DATAOFFSET: number = 54;
    private readonly INFOHEADER_SIZE: number = 40;

}
