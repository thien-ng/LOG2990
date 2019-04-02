import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { GameMode } from "../../../common/communication/iCard";
import { CServer } from "../CServer";
import { AssetManagerService } from "../services/asset-manager.service";

// tslint:disable no-magic-numbers no-any
const IMAGES_PATH: string = "./app/asset/image";

let imageManagerService: AssetManagerService;

describe("Image manager service tests", () => {

    chai.use(spies);

    const buffer: Buffer = Buffer.from(["dfgx"]);

    beforeEach(() => {
        imageManagerService = new AssetManagerService();
    });

    it("should call the stockImage function when creating bmp", () => {
        const spy: any = chai.spy.on(imageManagerService, "stockImage");
        imageManagerService.createBMP(buffer, 6);
        chai.expect(spy).to.have.been.called();
        const path: string = IMAGES_PATH + "/" + 6 + CServer.GENERATED_FILE;
        imageManagerService.deleteStoredImages([path]);
    });

    it("should throw an error when deleting non existing path", () => {
        const paths: string[] = [
            CServer.IMAGES_PATH + "/" + 12 + CServer.GENERATED_SNAPSHOT,
            CServer.SCENE_PATH  + "/" + 12 + CServer.ORIGINAL_SCENE_FILE,
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
        const path: string[] = [CServer.IMAGES_PATH + "/test"];
        chai.expect(() => {
            imageManagerService.saveImage(path[0], "string");
            imageManagerService.deleteStoredImages(path);
        }).to.not.throw(TypeError);
    });

    it("should not throw an error when deleting a stocked image", () => {
        const path: string[] = [CServer.IMAGES_PATH + "/test"];
        chai.expect(() => {
            imageManagerService.stockImage(path[0], buffer);
            imageManagerService.deleteStoredImages(path);
        }).to.not.throw(TypeError);
    });

    it("should not throw an error when deleting a stocked image", () => {
        const path: string[] = [CServer.IMAGES_PATH + "/test"];
        chai.expect(() => {
            imageManagerService.saveGeneratedScene(path[0], "string");
            imageManagerService.deleteStoredImages(path);
        }).to.not.throw(TypeError);
    });

    it("should copy an image to the temp directory (no error thrown)", async () => {
        const gameId: number = 5;
        const path: string = CServer.IMAGES_PATH + "/testBitmap/" + "7dots.bmp";
        chai.expect(() => imageManagerService["copyFileToTemp"](path, gameId, CServer.GENERATED_FILE))
            .to.not.throw(TypeError("error while generating file"));
    });

    it("should not copy an inexistant image to the temp directory and throw error", async () => {
        const nonExistantgameId: number = 15;
        const path: string = CServer.IMAGES_PATH + "/testBitmap/" + nonExistantgameId + CServer.GENERATED_FILE;
        chai.expect(() => { imageManagerService["copyFileToTemp"](path, nonExistantgameId, CServer.GENERATED_FILE); })
            .to.throw(TypeError);
    });

    it("should delete an image to the temp directory (no error thrown)", async () => {
        const gameId: number = 5;
        chai.expect(() => imageManagerService.deleteFileInTemp(gameId, CServer.GENERATED_FILE))
            .to.not.throw(TypeError);
    });

    it("should not delete an inexistant image to the temp directory and throw error", async () => {
        const nonExistantgameId: number = 15;
        chai.expect(() => imageManagerService.deleteFileInTemp(nonExistantgameId, CServer.GENERATED_FILE))
            .to.throw(TypeError);
    });

    it("should not get Theme file and throw error", async () => {
        const themeName: string = "CestWRrrrrronnng";
        chai.expect(() => imageManagerService.getTheme(themeName))
            .to.throw(TypeError);
    });

    it("should do temp routine for 2d and throw error", async () => {
        const gameId: number = 9999999;
        chai.expect(() => imageManagerService.tempRoutine2d(gameId))
            .to.throw(TypeError);
    });

    it("should do temp routine for 3d and throw error", async () => {
        const gameId: number = 9999999;
        chai.expect(() => imageManagerService.tempRoutine3d(gameId))
            .to.throw(TypeError);
    });

    it("should set new value of countGameId to map", async () => {
        const gameId: number = 9999999;
        imageManagerService["countByGameId"].set(gameId, 1000);
        imageManagerService["manageCounter"](gameId);
        chai.expect(imageManagerService["countByGameId"].get(gameId)).to.equal(1001);
    });

    it("should set new value of countGameId to map", async () => {
        const gameId: number = 9999999;
        imageManagerService["countByGameId"].set(gameId, 1000);
        imageManagerService["manageCounter"](gameId);
        chai.expect(imageManagerService["countByGameId"].get(gameId)).to.equal(1001);
    });

    it("should decrement map size", async () => {
        const gameId: number = 9999999;
        const spy: any = chai.spy.on(imageManagerService["countByGameId"], "set");
        imageManagerService.decrementTempCounter(gameId, 1);
        chai.expect(spy).to.have.been.called();
    });

    it("should decrement map size", async () => {
        const gameId: number = 1;
        imageManagerService["countByGameId"].set(1, 1);
        const result: number | undefined = imageManagerService.getCounter(gameId);
        chai.expect(result).to.equal(1);
    });

    it("should throw error when getting card by wrong id", async () => {
        const gameId: number = 9999999;
        chai.expect(() => imageManagerService.getCardById(gameId.toString(), GameMode.simple))
            .to.throw(TypeError);
    });
});
