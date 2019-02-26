import { AxiosInstance } from "axios";
import * as MockAdapter from "axios-mock-adapter";
import * as chai from "chai";
import * as spies from "chai-spies";
import * as fs from "fs";
import * as path from "path";
import { of } from "rxjs/index";
import sinon = require("sinon");

import { IOriginalPixelCluster, IPlayerInputResponse, IPosition2D } from "../../../../../common/communication/iGameplay";
import { IUser } from "../../../../../common/communication/iUser";
import { Constants } from "../../../constants";
import { BMPBuilder } from "../../../services/difference-checker/utilities/bmpBuilder";
import { Arena } from "../../../services/game/arena/arena";
import { IArenaInfos, IHitConfirmation, IPlayerInput } from "../../../services/game/arena/interfaces";
import { Player } from "../../../services/game/arena/player";
import { GameManagerService } from "../../../services/game/game-manager.service";
import { UserManagerService } from "../../../services/user-manager.service";

// tslint:disable:no-magic-numbers no-any max-file-line-count

const activeUser: IUser = {
    username: "mike",
    socketID: "123",
 };

const hitPosition: IPosition2D = {
    x: 1,
    y: 1,
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
            position: hitPosition,
        },
    ],
};

const playerInputClick: IPlayerInput = {
    event:      Constants.CLICK_EVENT,
    arenaId:    1,
    user:       activeUser,
    position:   hitPosition,
};
const playerInputWrong: IPlayerInput = {
    event:      "wrongInput",
    arenaId:    1,
    user:       activeUser,
    position:   hitPosition,
};
let arena: Arena;
const arenaInfo: IArenaInfos = {
        arenaId:            1,
        users:              [activeUser],
        originalGameUrl:    "http://localhost:3000/image/1_original.bmp",
        differenceGameUrl:  "http://localhost:3000/image/1_generated.bmp",
    };

const axios: AxiosInstance = require("axios");

let gameManager:            GameManagerService;
const testImageOriginale:   Buffer = fs.readFileSync(path.resolve(__dirname, "../../../asset/image/1_original.bmp"));

let mockAxios: any;

describe("Arena tests", () => {

    beforeEach(async () => {
        gameManager = new GameManagerService(new UserManagerService());
        arena       = new Arena(arenaInfo, gameManager);
        arena.timer.stopTimer();
        mockAxios   = new MockAdapter.default(axios);
        chai.use(spies);

        // build arena with images bufferOriginal & bufferDifferences
        const builder:          BMPBuilder  = new BMPBuilder(4, 4, 100);
        const bufferOriginal:   Buffer      = Buffer.from(builder.buffer);
        builder.setColorAtPos(1, 1, 1, 1, 1);
        const bufferDifferences: Buffer     = Buffer.from(builder.buffer);

        mockAxios.onGet(arenaInfo.originalGameUrl).replyOnce(200, () => {
            return bufferOriginal;
        });
        mockAxios.onGet(arenaInfo.differenceGameUrl).replyOnce(200, () => {
            return bufferDifferences;
        });

        await arena.prepareArenaForGameplay()
        .then(() => { /* */ })
        .catch((error: Error) => {
            // errorMessage = error.message;
        });

    });

    afterEach(() => {
        mockAxios.restore();

    });

    it("should be able to extract original pixel clusters from buffers ", async () => {

        const spy: any  = chai.spy.on(arena, "extractOriginalPixelClusters");
        mockAxios       = new MockAdapter.default(axios);

        mockAxios.onGet(arenaInfo.originalGameUrl, {
            responseType: "arraybuffer",
        }).reply(200, (response: Buffer) => {
            return testImageOriginale;
        } );

        await arena.prepareArenaForGameplay()
        .then((response: any) => {
            return response;
        })
        .catch((error: Error) => { /* */ });

        chai.expect(spy).to.have.been.called();
    });

    it("should handle an error when HTTP request fails", async () => {

        let errorMessage: string = "";
        mockAxios = new MockAdapter.default(axios);

        mockAxios.onGet(arenaInfo.originalGameUrl, {
            responseType: "arraybuffer",
        }).reply(400, (response: Buffer) => {
            return response;
        } );
        await arena.prepareArenaForGameplay()
        .then(() => { /* Do nothing */ })
        .catch((error: Error) => {
            errorMessage = error.message;
        });

        chai.expect(errorMessage).to.equal("Didn't succeed to get image buffer from URL given. File: arena.ts.");
    });

    it("should validate hit with a call to a microservice", async () => {

        const expectedResponse: IPlayerInputResponse = {
            status:     Constants.ON_SUCCESS_MESSAGE,
            response:   expectedPixelClusters,
        };
        const sandbox: sinon.SinonSandbox = sinon.createSandbox();
        sandbox.stub(arena, "onPlayerClick").callsFake( async () => of(expectedResponse).toPromise());

        const responseToInput: IPlayerInputResponse = await arena.onPlayerInput(playerInputClick);

        chai.expect(responseToInput).to.deep.equal(expectedResponse);
        sandbox.restore();
    });

    it("should return a failed response when the event passed isn't recognize", async () => {

        const expectedResponse: IPlayerInputResponse = {
            status:     "onFailedClick",
            response:   Constants.ON_ERROR_PIXEL_CLUSTER,
        };
        const sandbox: sinon.SinonSandbox = sinon.createSandbox();
        sandbox.stub(arena, "onPlayerClick").callsFake( async () => of(expectedResponse).toPromise());

        const responseToInput:  IPlayerInputResponse = await arena.onPlayerInput(playerInputWrong);

        chai.expect(responseToInput).to.deep.equal(expectedResponse);
        sandbox.restore();
    });

    it("should return a correct PlayerInputResponse", async () => {
        const playerInputResponseExpected: IPlayerInputResponse = {
            status:     Constants.ON_SUCCESS_MESSAGE,
            response:   expectedPixelClusters,
        };

        const hitConfirmationExpected: IHitConfirmation = {
            isAHit:         true,
            hitPixelColor:  [ 1, 1, 1],
        };

        mockAxios.onPost(Constants.URL_HIT_VALIDATOR).reply(200, hitConfirmationExpected);

        let responseToPlayerInput: IPlayerInputResponse | void;
        arena["originalPixelClusters"].set(1, expectedPixelClusters);

        responseToPlayerInput = await arena.onPlayerClick(hitPosition, activeUser);

        chai.expect(responseToPlayerInput).to.deep.equal(playerInputResponseExpected);
        mockAxios.restore();
    });

    it("should return an error on problematic HitConfirmation", async () => {
        const playerInputResponseExpected: IPlayerInputResponse = {
            status:     Constants.ON_ERROR_MESSAGE,
            response:   Constants.ON_ERROR_PIXEL_CLUSTER,
        };

        mockAxios.onPost(Constants.URL_HIT_VALIDATOR).reply(200, {});

        let responseToPlayerInput: IPlayerInputResponse | void;
        arena["originalPixelClusters"].set(1, expectedPixelClusters);

        responseToPlayerInput = await arena.onPlayerClick(hitPosition, activeUser);

        chai.expect(responseToPlayerInput).to.deep.equal(playerInputResponseExpected);
        mockAxios.restore();
    });

    it("should be able to return a hit validation response", async () => {

        const hitConfirmationExpected: IHitConfirmation = {
            isAHit:         true,
            hitPixelColor:  [ 1, 1, 1],
        };

        mockAxios.onPost(Constants.URL_HIT_VALIDATOR).reply(200, hitConfirmationExpected);

        const responseToValidation: IHitConfirmation = await arena.validateHit(hitPosition);

        chai.expect(responseToValidation).to.deep.equal(hitConfirmationExpected);
    });

    it("should be able to catch an error during the hitValidation process", async () => {

        mockAxios.onPost(Constants.URL_HIT_VALIDATOR, hitPosition).reply(200, { response: "nope"});

        let errorMessage: string = "";

        try {
           await arena.validateHit(hitPosition);
        } catch (error) {
            errorMessage = error.message;
        }

        chai.expect(errorMessage).to.equal("Problem during Hit Validation process.");
    });

    it("should return the players in the arena", async () => {
        const players:      Player[]    = arena.getPlayers();
        const playerInside: Player      = new Player(activeUser);

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

    it("should send time to player every second", () => {
        const clock:    any = sinon.useFakeTimers();
        const spy:      any = chai.spy.on(arena.gameManagerService, "sendMessage");

        arena["initTimer"]();
        clock.tick(1010);
        chai.expect(spy).to.have.been.called();
        clock.restore();
    });

    it("should set the right number of points to win depending on number of players", () => {

        arenaInfo.users = [activeUser, activeUser];
        arena           = new Arena(arenaInfo, gameManager);
        arena.timer.stopTimer();

        const pointsNeededToWin: number = arena["pointsNeededToWin"];

        chai.expect(pointsNeededToWin).to.equal(4);
    });
});
