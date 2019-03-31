import { AxiosInstance } from "axios";
import * as MockAdapter from "axios-mock-adapter";
import * as chai from "chai";
import * as spies from "chai-spies";
import * as fs from "fs";
import * as path from "path";
import { of } from "rxjs/index";
import sinon = require("sinon");
import { CCommon } from "../../../../../common/constantes/cCommon";
import { CServer } from "../../../CServer";

import { BMPBuilder } from "../../../services/difference-checker/utilities/bmpBuilder";
import { Player } from "../../../services/game/arena/player";
import { GameManagerService } from "../../../services/game/game-manager.service";
import { UserManagerService } from "../../../services/user-manager.service";

import { IArenaResponse, IOriginalPixelCluster, IPosition2D } from "../../../../../common/communication/iGameplay";
import { IUser } from "../../../../../common/communication/iUser";
import { AssetManagerService } from "../../../services/asset-manager.service";
import { CardOperations } from "../../../services/card-operations.service";
import { ChatManagerService } from "../../../services/chat-manager.service";
import { Arena2D } from "../../../services/game/arena/arena2d";
import { I2DInfos, IArenaInfos, IPlayerInput } from "../../../services/game/arena/interfaces";
import { LobbyManagerService } from "../../../services/game/lobby-manager.service";
import { HighscoreService } from "../../../services/highscore.service";
import { TimeManagerService } from "../../../services/time-manager.service";

// tslint:disable:no-magic-numbers no-any max-file-line-count no-empty max-line-length

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

const playerInputClick: IPlayerInput<IPosition2D> = {
    event:      CServer.CLICK_EVENT,
    arenaId:    1,
    user:       activeUser,
    eventInfo:  hitPosition,
};

const playerInputWrong: IPlayerInput<IPosition2D> = {
    event:      "wrongInput",
    arenaId:    1,
    user:       activeUser,
    eventInfo:  hitPosition,
};

let arena: Arena2D;
const arenaInfo: IArenaInfos<I2DInfos> = {
        arenaId:            1,
        users:              [activeUser],
        dataUrl:            {
            original:       CServer.PATH_TO_IMAGES + "/1_original.bmp",
            difference:     CServer.PATH_TO_IMAGES + "/1_generated.bmp",
        },
    };

const axios: AxiosInstance = require("axios");

let gameManager:            GameManagerService;
let userManagerService:     UserManagerService;
let highscoreService:       HighscoreService;
let chatManagerService:     ChatManagerService;
let timeManagerService:     TimeManagerService;
let cardOperations:         CardOperations;
let lobbyManagerService:    LobbyManagerService;
let assetManagerService:    AssetManagerService;

const testImageOriginale:   Buffer = fs.readFileSync(path.resolve(__dirname, "../../../asset/image/1_original.bmp"));

let mockAxios: any;

describe("Arena 2D tests", () => {

    beforeEach(async () => {
        assetManagerService = new AssetManagerService();
        lobbyManagerService = new LobbyManagerService();
        userManagerService  = new UserManagerService();
        highscoreService    = new HighscoreService(assetManagerService);
        timeManagerService  = new TimeManagerService();
        chatManagerService  = new ChatManagerService(timeManagerService);
        cardOperations      = new CardOperations(highscoreService);
        gameManager         = new GameManagerService(userManagerService, highscoreService, chatManagerService, cardOperations, lobbyManagerService);
        arena               = new Arena2D(arenaInfo, gameManager);
        mockAxios           = new MockAdapter.default(axios);
        chai.use(spies);

        // build arena with images bufferOriginal & bufferDifferences
        const builder:          BMPBuilder  = new BMPBuilder(4, 4, 100);
        const bufferOriginal:   Buffer      = Buffer.from(builder.buffer);
        builder.setColorAtPos(1, 1, 1, 1, 1);
        const bufferDifferences: Buffer     = Buffer.from(builder.buffer);

        mockAxios.onGet(arenaInfo.dataUrl.original).replyOnce(200, () => {
            return bufferOriginal;
        });
        mockAxios.onGet(arenaInfo.dataUrl.difference).replyOnce(200, () => {
            return bufferDifferences;
        });

        await arena.prepareArenaForGameplay()
        .then(() => { /* */ })
        .catch((error: Error) => {});

        arena["referee"].timer.stopTimer();

    });

    afterEach(() => {
        mockAxios.restore();

    });

    it("should get empty difference ids list", async () => {
        const result: number[] = arena.getDifferencesIds();
        chai.expect(result.length).to.equal(0);
    });

    it("should  call onPlayersReady from referee", async () => {
        const spy: any = chai.spy.on(arena["referee"], "onPlayersReady");

        arena.onPlayerReady("123");
        chai.expect(spy).called();
    });

    it("should  wait for referee when players are ready", async () => {
        const clock: any = sinon.useFakeTimers();

        arena = new Arena2D(arenaInfo, gameManager);
        const spy: any = chai.spy.on(arena, "waitForReferee");

        arena.onPlayerReady("123");
        clock.tick(4000);
        await arena.prepareArenaForGameplay()
        .then(() => {
            arena["referee"].timer.stopTimer();
        })
        .catch((error: Error) => {});

        chai.expect(spy).called();
        clock.restore();
    });

    it("should be able to extract original pixel clusters from buffers ", async () => {

        const spy: any  = chai.spy.on(arena, "extractOriginalPixelClusters");
        mockAxios       = new MockAdapter.default(axios);

        mockAxios.onGet(arenaInfo.dataUrl.original, {
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

        mockAxios.onGet(arenaInfo.dataUrl.original, {
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

        const expectedResponse: IArenaResponse<IOriginalPixelCluster> = {
            status:     CCommon.ON_SUCCESS,
            response:   expectedPixelClusters,
        };
        const sandbox: sinon.SinonSandbox = sinon.createSandbox();
        sandbox.stub(arena["referee"], "onPlayerClick").callsFake( async () => of(expectedResponse).toPromise());

        const responseToInput: IArenaResponse<IOriginalPixelCluster> = await arena.onPlayerInput(playerInputClick);

        chai.expect(responseToInput).to.deep.equal(expectedResponse);
        sandbox.restore();
    });

    it("should return a failed response when the event passed isn't recognize", async () => {

        const expectedResponse: IArenaResponse<IOriginalPixelCluster> = {
            status:     "onFailedClick",
        };
        const sandbox: sinon.SinonSandbox = sinon.createSandbox();
        sandbox.stub(arena["referee"], "onPlayerClick").callsFake( async () => of(expectedResponse).toPromise());

        const responseToInput:  IArenaResponse<IOriginalPixelCluster> = await arena.onPlayerInput(playerInputWrong);

        chai.expect(responseToInput).to.deep.equal(expectedResponse);
        sandbox.restore();
    });

    it("should be able to catch an error during the hitValidation process", async () => {

        mockAxios.onPost(CServer.URL_HIT_VALIDATOR, hitPosition).reply(200, { response: "nope"});

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

        arena["referee"]["initTimer"]();
        clock.tick(1010);
        chai.expect(spy).to.have.been.called();
        clock.restore();
    });

    it("should set the right number of points to win depending on number of players", async () => {

        gameManager = new GameManagerService(userManagerService, highscoreService, chatManagerService, cardOperations, lobbyManagerService);
        arenaInfo.users = [activeUser, activeUser];

        arena       = new Arena2D(arenaInfo, gameManager);
        mockAxios   = new MockAdapter.default(axios);

        const builder:          BMPBuilder  = new BMPBuilder(4, 4, 100);
        const bufferOriginal:   Buffer      = Buffer.from(builder.buffer);
        builder.setColorAtPos(1, 1, 1, 1, 1);
        const bufferDifferences: Buffer     = Buffer.from(builder.buffer);

        mockAxios.onGet(arenaInfo.dataUrl.original).replyOnce(200,   () => bufferOriginal );
        mockAxios.onGet(arenaInfo.dataUrl.difference).replyOnce(200, () => bufferDifferences );

        await arena.prepareArenaForGameplay()
        .then(() => { /* */ })
        .catch((error: Error) => { /* Do nothing */ });

        arena["referee"].timer.stopTimer();

        const pointsNeededToWin: number = arena["referee"]["pointsNeededToWin"];

        chai.expect(pointsNeededToWin).to.equal(4);
    });

    it("Should call the end of game function of the game manager single player mode", async () => {
        const spy: any  = chai.spy.on(gameManager, "endOfGameRoutine");
        arena = new Arena2D(arenaInfo, gameManager);
        arena["players"] = [];
        arena.getPlayers().push(new Player({username: "username1", socketID: "socket1"}));
        arena.endOfGameRoutine(1, new Player(activeUser));

        chai.expect(spy).to.have.been.called();
    });

    it("Should call the end of game function of the game manager multi player mode", async () => {
        const spy: any  = chai.spy.on(gameManager, "endOfGameRoutine");
        arena.endOfGameRoutine(1, new Player(activeUser));

        chai.expect(spy).to.have.been.called();
    });

});
