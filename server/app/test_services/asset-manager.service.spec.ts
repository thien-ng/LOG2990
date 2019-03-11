import * as chai from "chai";
import * as spies from "chai-spies";
import * as fs from "fs";
import "reflect-metadata";
import { setTimeout } from "timers";
import { Constants } from "../constants";
import { AssetManagerService } from "../services/asset-manager.service";

/*tslint:disable no-magic-numbers no-any */
const IMAGES_PATH: string = "./app/asset/image";

let imageManagerService: AssetManagerService;

describe("Image manager service tests", () => {

    chai.use(spies);

    const buffer: Buffer = Buffer.from(["dfgx"]);

    beforeEach(() => {
        imageManagerService = new AssetManagerService();
    });

    it("Should call the stockImage funciton when creating bmp", () => {
        const spy: any = chai.spy.on(imageManagerService, "stockImage");
        imageManagerService.createBMP(buffer, 6);
        chai.expect(spy).to.have.been.called();
        const path: string = IMAGES_PATH + "/" + 6 + Constants.GENERATED_FILE;
        imageManagerService.deleteStoredImages([path]);
    });
    it("should throw an error when deleting non existing path", () => {
        const paths: string[] = [
            Constants.IMAGES_PATH + "/" + 12 + Constants.GENERATED_SNAPSHOT,
            Constants.SCENE_PATH  + "/" + 12 + Constants.ORIGINAL_SCENE_FILE,
        ];
        chai.expect(() => {
            imageManagerService.deleteStoredImages(paths);
        }).to.throw(TypeError);
    });
    it("should throw an error when calling stockImage with invalid path", () => {
        const path: string = "../folder/nonexistenpath";
        chai.expect(() => {
            imageManagerService.stockImage(path, buffer);
        }).to.throw(TypeError);
    });
    it("should throw an error when calling saveImage with invalid path", () => {
        const path: string = "../folder/nonexistenpath";
        chai.expect(() => {
            imageManagerService.saveImage(path, "string");
        }).to.throw(TypeError);
    });
    it("should throw an error when calling saveGeneratedScene with invalid path", () => {
        const path: string = "../folder/nonexistenpath";
        chai.expect(() => {
            imageManagerService.saveGeneratedScene(path, "string");
        }).to.throw(TypeError);
    });
    it("should not throw an error when deleting a stocked image", () => {
        const path: string[] = [Constants.IMAGES_PATH + "/test"];
        chai.expect(() => {
            imageManagerService.saveImage(path[0], "string");
            imageManagerService.deleteStoredImages(path);
        }).to.not.throw(TypeError);
    });
    it("should not throw an error when deleting a stocked image", () => {
        const path: string[] = [Constants.IMAGES_PATH + "/test"];
        chai.expect(() => {
            imageManagerService.stockImage(path[0], buffer);
            imageManagerService.deleteStoredImages(path);
        }).to.not.throw(TypeError);
    });
    it("should not throw an error when deleting a stocked image", () => {
        const path: string[] = [Constants.IMAGES_PATH + "/test"];
        chai.expect(() => {
            imageManagerService.saveGeneratedScene(path[0], "string");
            imageManagerService.deleteStoredImages(path);
        }).to.not.throw(TypeError);
    });
    it("Should copy an image to the temp directory", async (done: Function) => {
        const gameId: number = 1;
        const imgPathTemp: string = Constants.TEMP_IMAGES_PATH + gameId + Constants.GENERATED_FILE;
        const path: string = Constants.IMAGES_PATH + "/testBitmap/" + gameId + Constants.GENERATED_FILE;
        setTimeout(() => { imageManagerService.stockImage(path, buffer);}, 1000);
        setTimeout(() => {
            imageManagerService.copyFileToTemp(path, gameId, Constants.GENERATED_FILE);}, 2000);
        done();
        chai.expect(fs.existsSync(imgPathTemp)).to.equal(true);
    });
    it("Should delete an image to the temp directory", () => {
        const gameId: number = 1;
        const imgPathTemp: string = Constants.TEMP_IMAGES_PATH + gameId + Constants.GENERATED_FILE;
        setTimeout(() => { imageManagerService.deleteFileInTemp(gameId, Constants.GENERATED_FILE); },2000);
        chai.expect(fs.existsSync(imgPathTemp)).to.equal(false);
    });
});
