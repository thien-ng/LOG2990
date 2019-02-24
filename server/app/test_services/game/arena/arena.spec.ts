import { AxiosInstance } from "axios";
import * as MockAdapter from "axios-mock-adapter";
import * as chai from "chai";
import * as spies from "chai-spies";
import * as fs from "fs";
import * as path from "path";
import { IOriginalPixelCluster, IPlayerInputResponse } from "../../../../../common/communication/iGameplay";
import { User } from "../../../../../common/communication/iUser";
import { Constants } from "../../../constants";
import { BMPBuilder } from "../../../services/difference-checker/utilities/bmpBuilder";
import { Arena } from "../../../services/game/arena/arena";
import { IArenaInfos, IPlayerInput } from "../../../services/game/arena/interfaces";
import { GameManagerService } from "../../../services/game/game-manager.service";
import { UserManagerService } from "../../../services/user-manager.service";

import { of } from "rxjs";
import sinon = require("sinon");
import { Player } from "../../../services/game/arena/player";

// tslint:disable:no-magic-numbers no-any

const activeUser: User = {
    username: "mike",
    socketID: "123",
 };

const expectedPixelClusters: IOriginalPixelCluster = {
    differenceKey:  1,
    cluster: [
        {
            color: {
                R: 100,
                G: 100,
                B: 100,
            },
            position: {
                x: 1,
                y: 1,
            },
        },
    ],
};

const playerInputClick: IPlayerInput = {
    event:      Constants.CLICK_EVENT,
    arenaId:    1,
    user:       activeUser,
    position: {
        x: 1,
        y: 1,
    },
};
const playerInputWrong: IPlayerInput = {
    event:      "wrongInput",
    arenaId:    1,
    user:       activeUser,
    position: {
        x: 1,
        y: 1,
    },
};
let arena: Arena;
const arenaInfo: IArenaInfos = {
        arenaId:            1,
        users:              [activeUser],
        originalGameUrl:    "http://localhost:3000/images/1_original.bmp",
        differenceGameUrl:  "http://localhost:3000/images/1_generated.bmp",
    };

const axios: AxiosInstance = require("axios");

let gameManager:            GameManagerService;
const testImageOriginale:   Buffer = fs.readFileSync(path.resolve(__dirname, "../../../asset/image/1_original.bmp"));
// const testImageDiff:        Buffer = fs.readFileSync(path.resolve(__dirname, "../../../asset/image/1_generated.bmp"));

let mockAxios: any;

describe("Arena tests", () => {

    beforeEach(() => {
        gameManager = new GameManagerService(new UserManagerService());
        arena = new Arena(arenaInfo, gameManager);
        arena.timer.stopTimer();
        mockAxios = new MockAdapter.default(axios);
        chai.use(spies);

    });

    afterEach(() => {
        mockAxios.restore();

    });

    it("should be able to extract original pixel clusters from buffers ", async () => {

        const spy: any = chai.spy.on(arena, "extractOriginalPixelClusters");

        mockAxios.onGet(arenaInfo.originalGameUrl, {
            responseType: "arraybuffer",
        }).reply(200, (response: Buffer) => {
            return testImageOriginale;
        } );

        await arena.prepareArenaForGameplay()
        .then((response: any) => {
            return response;
        })
        .catch((error: Error) => {
            // console.log(error);
        });

        chai.expect(spy).to.have.been.called();
    });

    it("should handle an error when HTTP request fails", async () => {

        let errorMessage: string = "";

        mockAxios.onGet(arenaInfo.originalGameUrl, {
            responseType: "arraybuffer",
        }).reply(400, (response: Buffer) => {
            return response;
        } );
        await arena.prepareArenaForGameplay()
        .then(() => { /* */ })
        .catch((error: Error) => {
            errorMessage = error.message;
        });

        chai.expect(errorMessage).to.equal("Didn't succeed to get image buffer from URL given. File: arena.ts.");
    });

    it("should validate hit with a call to a microservice", async () => {

        const builder: BMPBuilder = new BMPBuilder(4, 4, 100);
        const bufferOriginal: Buffer = Buffer.from(builder.buffer);
        builder.setColorAtPos(1, 1, 1, 1, 1);
        const bufferDifferences: Buffer = Buffer.from(builder.buffer);

        mockAxios.onGet(arenaInfo.originalGameUrl).replyOnce(200, () => {
            return bufferOriginal;
        });
        mockAxios.onGet(arenaInfo.differenceGameUrl).replyOnce(200, () => {
            return bufferDifferences;
        });
        const expectedResponse: IPlayerInputResponse = {
            status: Constants.ON_SUCCESS_MESSAGE,
            response: expectedPixelClusters,
        };
        const sandbox: sinon.SinonSandbox = sinon.createSandbox();
        sandbox.stub(arena, "onPlayerClick").callsFake(() => of(expectedResponse).toPromise());

        await arena.prepareArenaForGameplay()
        .then(() => { /* */ })
        .catch((error: Error) => {
            // errorMessage = error.message;
        });

        const responseToInput:  IPlayerInputResponse = await arena.onPlayerInput(playerInputClick);

        chai.expect(responseToInput).to.deep.equal(expectedResponse);

        sandbox.restore();
    });

    it("should return a failed response when the event passed isn't recognize", async () => {

        const builder: BMPBuilder = new BMPBuilder(4, 4, 100);
        const bufferOriginal: Buffer = Buffer.from(builder.buffer);
        builder.setColorAtPos(1, 1, 1, 1, 1);
        const bufferDifferences: Buffer = Buffer.from(builder.buffer);

        mockAxios.onGet(arenaInfo.originalGameUrl).replyOnce(200, () => {
            return bufferOriginal;
        });
        mockAxios.onGet(arenaInfo.differenceGameUrl).replyOnce(200, () => {
            return bufferDifferences;
        });
        const expectedResponse: IPlayerInputResponse = {
            status: "onFailedClick",
            response: Constants.ON_ERROR_PIXEL_CLUSTER,
        };
        const sandbox: sinon.SinonSandbox = sinon.createSandbox();
        sandbox.stub(arena, "onPlayerClick").callsFake(() => of(expectedResponse).toPromise());

        await arena.prepareArenaForGameplay()
        .then(() => { /* */ })
        .catch((error: Error) => {
            // errorMessage = error.message;
        });

        const responseToInput:  IPlayerInputResponse = await arena.onPlayerInput(playerInputWrong);

        chai.expect(responseToInput).to.deep.equal(expectedResponse);

        sandbox.restore();
    });

    it("should return the players in the arena", async () => {
        const players: Player[] = arena.getPlayers();
        const playerInside: Player = new Player(activeUser);

        chai.expect(playerInside).to.deep.equal(players[0]);
    });

    it("should be able to confirm the presence of a player in the arena on contains()", () => {
        const isPresent: boolean = arena.contains(activeUser);
        chai.expect(isPresent).to.equal(true);
    });

    it("should be able to remove a player from the arena", () => {
        arena.removePlayer(activeUser.username);
        const players: Player[] = arena.getPlayers();
        chai.expect(players.length).to.equal(0);
    });

});
