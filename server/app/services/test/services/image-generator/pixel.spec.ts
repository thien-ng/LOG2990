import { expect } from "chai";
import { Pixel } from "../../../image-generator/pixel";

let pixel: Pixel;

beforeEach(() => {
    pixel = new Pixel(1,2,3,4);
});