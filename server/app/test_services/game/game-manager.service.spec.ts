import "reflect-metadata";

import * as chai from "chai";
import * as spies from "chai-spies";
import * as fs from "fs";
import * as path from "path";
import SocketIO = require("socket.io");
import { mock, verify } from "ts-mockito";
import { GameMode } from "../../../../common/communication/iCard";
import { IGameRequest } from "../../../../common/communication/iGameRequest";
import { IArenaResponse, IOriginalPixelCluster, IPosition2D } from "../../../../common/communication/iGameplay";
import { IUser } from "../../../../common/communication/iUser";
import { Message } from "../../../../common/communication/message";
import { CCommon } from "../../../../common/constantes/cCommon";
// import { Constants } from "../../constants";
import { CardOperations } from "../../services/card-operations.service";
import { ChatManagerService } from "../../services/chat-manager.service";
import { Arena2D } from "../../services/game/arena/arena2d";
import { I2DInfos, IArenaInfos, IPlayerInput } from "../../services/game/arena/interfaces";
import { GameManagerService } from "../../services/game/game-manager.service";
import { LobbyManagerService } from "../../services/game/lobby-manager.service";
import { HighscoreService } from "../../services/highscore.service";
import { Mode } from "../../services/highscore/utilities/interfaces";
import { TimeManagerService } from "../../services/time-manager.service";
import { UserManagerService } from "../../services/user-manager.service";

// tslint:disable no-magic-numbers no-any await-promise no-floating-promises max-file-line-count max-func-body-length no-empty

let lobbyManagerService:    LobbyManagerService;
let gameManagerService:     GameManagerService;
let userManagerService:     UserManagerService;
let highscoreService:       HighscoreService;
let chatManagerService:     ChatManagerService;
let timeManagerService:     TimeManagerService;
let cardOperations:         CardOperations;

const mockAdapter:  any = require("axios-mock-adapter");
const axios:        any = require("axios");
let mockAxios:      any;

const request2DSimple: IGameRequest = {
    username:   "Frank",
    gameId:     1,
    type:       Mode.Singleplayer,
    mode:       GameMode.simple,
};

const request3DSimple: IGameRequest = {
    username:   "Franky",
    gameId:     2,
    type:       Mode.Singleplayer,
    mode:       GameMode.free,
};

const request2DMulti: IGameRequest = {
    username:   "Frank",
    gameId:     1,
    type:       Mode.Multiplayer,
    mode:       GameMode.simple,
};

const request3DMulti: IGameRequest = {
    username:   "Franky",
    gameId:     2,
    type:       Mode.Multiplayer,
    mode:       GameMode.free,
};

const invalidRequest: IGameRequest = {
    username:   "Frankette",
    gameId:     103,
    type:       Mode.Singleplayer,
    mode:       GameMode.invalid,
};
const invalidRequestCreation: IGameRequest = {
    username:   "Frankette",
    gameId:     103,
    type:       Mode.Singleplayer,
    mode:       GameMode.simple,
};


const iArenaInfos: IArenaInfos<I2DInfos> = {
    arenaId:            1,
    users:              [{username: "Frank", socketID: "12345"}],
    dataUrl:            {
        original:    "../../../asset/image/1_original.bmp",
        difference:  "../../../asset/image/1_modified.bmp",
    },
};

const playerInput: IPlayerInput<IPosition2D | number> = {
    event:      "onClick",
    arenaId:    1,
    user: {
        username: "Frank",
        socketID: "12345",
    },
    eventInfo: {
        x: 12,
        y: 12,
    },
};

let socket: SocketIO.Socket;
let server: SocketIO.Server;
const original: Buffer = fs.readFileSync(path.resolve(__dirname, "../../asset/image/testBitmap/imagetestOg.bmp"));
const modified: Buffer = fs.readFileSync(path.resolve(__dirname, "../../asset/image/testBitmap/imagetestOg.bmp"));

beforeEach(() => {
    socket              = mock(SocketIO);
    server              = mock(SocketIO);
    lobbyManagerService = new LobbyManagerService();
    userManagerService  = new UserManagerService();
    highscoreService    = new HighscoreService();
    timeManagerService  = new TimeManagerService();
    chatManagerService  = new ChatManagerService(timeManagerService);
    cardOperations      = new CardOperations(highscoreService);

    gameManagerService  = new GameManagerService(userManagerService, highscoreService, chatManagerService, cardOperations, lobbyManagerService);
    mockAxios           = new mockAdapter.default(axios);
    gameManagerService["server"]  = server;
    lobbyManagerService["server"] = server;
});

describe("GameManagerService tests", () => {
    chai.use(spies);

    it("should add socketID in playerList", () => {

        gameManagerService.subscribeSocketID("dylan", socket);
        const result: SocketIO.Socket | undefined = gameManagerService.userList.get("dylan");
        chai.expect(result).to.be.equal(socket);
    });

    it("should add socketID in playerList", () => {

        const arena: Arena2D = new Arena2D(iArenaInfos, gameManagerService);
        gameManagerService["arenas"].set(iArenaInfos.arenaId, arena);
        const usersInArena: IUser[] = gameManagerService.getUsersInArena(iArenaInfos.arenaId);

        const isRightUsername:      boolean = usersInArena[0].username === "Frank";
        const isRightSocketId:      boolean = usersInArena[0].socketID === "12345";
        const isRightNumberOfUsers: boolean = usersInArena.length === 1;

        chai.expect(isRightSocketId && isRightUsername && isRightNumberOfUsers).to.equal(true);
    });

    it("should remove socketID in playerList", () => {

        gameManagerService.subscribeSocketID("dylan", socket);
        gameManagerService.subscribeSocketID("michelGagnon", socket);
        gameManagerService.unsubscribeSocketID("dylan", "");
        const result: SocketIO.Socket | undefined = gameManagerService.userList.get("michelGagnon");
        chai.expect(result).to.be.equal(socket);
    });

    it("Should return a success message when creating a 2D arena", async () => {
        userManagerService.validateName(request2DSimple.username);
        chai.spy.on(gameManagerService["assetManager"], ["tempRoutine2d"], () => {return; });

        mockAxios.onGet(iArenaInfos.dataUrl.original, {
            responseType: "arraybuffer",
        }).reply(200, original);

        mockAxios.onGet(iArenaInfos.dataUrl.difference, {
            responseType: "arraybuffer",
        }).reply(200, modified);

        chai.spy.on(gameManagerService, "buildArenaInfos", (returns: any) => iArenaInfos);
        chai.spy.on(gameManagerService, "init2DArena", () => {});

        gameManagerService.analyseRequest(request2DSimple).then((message: any) => {
            chai.expect(message.title).to.equal("onSuccess");
        });
        chai.spy.restore();
    });

    it("Should return a success message when creating a 2D arena", async () => {
        userManagerService.validateName(request2DSimple.username);
        chai.spy.on(gameManagerService["assetManager"], ["tempRoutine2d"], () => {return; });

        mockAxios.onGet(iArenaInfos.dataUrl.original, {
            responseType: "arraybuffer",
        }).reply(200, original);

        mockAxios.onGet(iArenaInfos.dataUrl.difference, {
            responseType: "arraybuffer",
        }).reply(200, modified);

        chai.spy.on(gameManagerService, "buildArenaInfos", (returns: any) => iArenaInfos);
        chai.spy.on(gameManagerService, "init2DArena", () => {});

        gameManagerService.analyseRequest(request2DSimple).then((message: any) => {
            chai.expect(message.title).to.equal("onSuccess");
        }).catch();

    });

    it("Should return a success message when creating a 3D arena", async () => {
        chai.spy.on(gameManagerService["assetManager"], ["tempRoutine3d"], () => {return; });
        userManagerService.validateName(request3DSimple.username);
        const message: Message = await gameManagerService.analyseRequest(request3DSimple);
        chai.expect(message.title).to.equal("onSuccess");
        chai.spy.restore();
    });

    it("Should return an error message when loading an invalid game", async () => {
        userManagerService.validateName(invalidRequest.username);
        const message: Message = await gameManagerService.analyseRequest(invalidRequest);
        chai.expect(message.body).to.equal("Game mode invalide");
    });

    it("Should return an error message when username doesnt exist", async () => {
        const message: Message = await gameManagerService.analyseRequest(invalidRequest);
        chai.expect(message.body).to.equal("Utilisateur inexistant");
    });

    it("Should return an error message when loading an invalid game", async () => {
        const ON_ERROR_ORIGINAL_PIXEL_CLUSTER: IOriginalPixelCluster = { differenceKey: -1, cluster: [] };
        const expectedMessage: IArenaResponse<any> = {
            status:     CCommon.ON_ERROR,
            response:   ON_ERROR_ORIGINAL_PIXEL_CLUSTER,
        };
        chai.expect(await gameManagerService.onPlayerInput(playerInput)).to.deep.equal(expectedMessage);
    });

    it("Should return error if wrong click after arena have been created", async () => {
        chai.spy.on(gameManagerService["assetManager"], ["tempRoutine2d"], () => {return; });
        userManagerService.validateName(request2DSimple.username);

        mockAxios.onGet(iArenaInfos.dataUrl.original, {
            responseType: "arraybuffer",
        }).reply(200, original);

        mockAxios.onGet(iArenaInfos.dataUrl.difference, {
            responseType: "arraybuffer",
        }).reply(200, modified);

        chai.spy.on(gameManagerService, "buildArenaInfos", (returns: any) => iArenaInfos);
        chai.spy.on(gameManagerService, "init2DArena", () => {});

        gameManagerService.analyseRequest(request2DSimple).catch();

        const ON_ERROR_ORIGINAL_PIXEL_CLUSTER: IOriginalPixelCluster = { differenceKey: -1, cluster: [] };
        const expectedMessage: IArenaResponse<any> = {
            status:     CCommon.ON_ERROR,
            response:   ON_ERROR_ORIGINAL_PIXEL_CLUSTER,
        };
        chai.expect(await gameManagerService.onPlayerInput(playerInput)).to.deep.equal(expectedMessage);
        chai.spy.restore();
    });

    // it("should remove player patate from arena and delete arena", async () => {
    //     userManagerService.validateName(request2DSimple.username);
    //     chai.spy.on(gameManagerService["assetManager"], "tempRoutine2d", () => {return; });
    //     chai.spy.on(gameManagerService, ["deleteArena"], () => {return; });

    //     mockAxios.onGet(iArenaInfos.dataUrl.original, {
    //         responseType: "arraybuffer",
    //     }).reply(200, original);

    //     mockAxios.onGet(iArenaInfos.dataUrl.difference, {
    //         responseType: "arraybuffer",
    //     }).reply(200, modified);

    //     chai.spy.on(gameManagerService["interfaceBuilder"], "buildArenaInfos", (returns: any) => iArenaInfos);
    //     chai.spy.on(gameManagerService["assetManager"], "copyFileToTemp", () => {return; });
    //     chai.spy.on(gameManagerService, "init2DArena", () => {});
    //     chai.spy.on(gameManagerService, ["deleteTempFiles"], () => {});
    //     chai.spy.on(gameManagerService["gameIdByArenaId"], "get", () => 1);
    //     chai.spy.on(gameManagerService["cardOperations"], "getCardById", () => "title");

    it("should remove player from arena and delete arena", async () => {
        const arena: Arena2D = new Arena2D(iArenaInfos, gameManagerService);
        const user: IUser = {
            username: "Frank",
            socketID: "12345",
        };
        const player: Player = new Player(user);
        arena["players"].push(player);
        const spy: any = chai.spy.on(arena, "removePlayer", () => {return; });
        gameManagerService["arenas"].set(1000, arena);
        gameManagerService.unsubscribeSocketID("12345", "Frank");
        chai.expect(spy).to.have.been.called();
    });

    it("should delete arena succesfully", async () => {
        userManagerService.validateName(request2DSimple.username);
        mockAxios.onGet(iArenaInfos.dataUrl.original, {
            responseType: "arraybuffer",
        }).reply(200, original);

        mockAxios.onGet(iArenaInfos.dataUrl.difference, {
            responseType: "arraybuffer",
        }).reply(200, modified);

        chai.spy.on(gameManagerService["interfaceBuilder"], "buildArenaInfos", (returns: any) => iArenaInfos);
        chai.spy.on(gameManagerService["assetManager"], "copyFileToTemp", () => {return; });
        chai.spy.on(gameManagerService, "init2DArena", () => {});
        chai.spy.on(gameManagerService, ["deleteTempFiles"], () => {});
        chai.spy.on(gameManagerService["gameIdByArenaId"], "get", () => 1);
        const spy: any = chai.spy.on(gameManagerService["arenas"], "delete");

        gameManagerService.analyseRequest(request2DSimple).catch();
        gameManagerService.deleteArena(iArenaInfos);
        chai.expect(spy).to.have.been.called();
        chai.spy.restore();
    });

    it("Should send message with socket", async () => {
        gameManagerService = new GameManagerService(userManagerService, highscoreService, chatManagerService, cardOperations, lobbyManagerService);
        gameManagerService.subscribeSocketID("socketID", socket);
        gameManagerService.sendMessage("socketID", "onEvent", 1);
        verify(socket.emit("onEvent", 1)).atLeast(0);
    });

    it("Should return a message saying onWaiting when no one is in the lobby", async () => {
        chai.spy.on(gameManagerService["assetManager"], "tempRoutine2d", () => {return; });
        userManagerService["users"].push({username: "Frank", socketID: "Frank"});
        const response: Message = await gameManagerService.analyseRequest(request2DMulti);
        chai.expect(response.title).to.deep.equal(CCommon.ON_WAITING);
        chai.spy.restore();
    });

    it("Should return a message saying onSuccess when someone is in the lobby (2D)", async () => {
        const request: IGameRequest = {
            username:   "Franky",
            gameId:     1,
            type:       Mode.Multiplayer,
            mode:       GameMode.simple,
        };
        chai.spy.on(gameManagerService["assetManager"], "tempRoutine2d", () => {return; });
        userManagerService["users"].push({username: "Franky", socketID: "Franky"});
        userManagerService["users"].push({username: "Frank", socketID: "Frank"});
        await gameManagerService.analyseRequest(request);
        const response: Message = await gameManagerService.analyseRequest(request2DMulti);
        chai.expect(response.title).to.deep.equal(CCommon.ON_SUCCESS);
        chai.spy.restore();
    });

    it("Should return a message saying onSuccess when someone is in the lobby (3D)", async () => {
        const request: IGameRequest = {
            username:   "Frank",
            gameId:     2,
            type:       Mode.Multiplayer,
            mode:       GameMode.free,
        };
        chai.spy.on(gameManagerService["assetManager"], "tempRoutine3d", () => {return; });
        userManagerService["users"].push({username: "Franky", socketID: "Franky"});
        userManagerService["users"].push({username: "Frank", socketID: "Frank"});
        gameManagerService.analyseRequest(request);
        const response: Message = await gameManagerService.analyseRequest(request3DMulti);
        chai.expect(response.title).to.deep.equal(CCommon.ON_SUCCESS);
        chai.spy.restore();
    });

    it("Should return an error message when deleting an unexisting arena", async () => {
        chai.expect(gameManagerService.cancelRequest(2, false).title).to.deep.equal(CCommon.ON_ERROR);
    });

    it("Should return a success message when deleting an existing arena", async () => {
        const user: IUser = {username: "Frank", socketID: "Frank"};
        lobbyManagerService["lobby"].set(1, [user]);
        chai.expect(gameManagerService.cancelRequest(1, false).title).to.deep.equal(CCommon.ON_SUCCESS);
    });

    it("Should throw an error if cannot copy the gameImages", async () => {
        userManagerService.validateName(request2DSimple.username);

        mockAxios.onGet(iArenaInfos.dataUrl.original, {
            responseType: "arraybuffer",
        }).reply(200, original);

        mockAxios.onGet(iArenaInfos.dataUrl.difference, {
            responseType: "arraybuffer",
        }).reply(200, modified);

        chai.spy.on(gameManagerService["interfaceBuilder"], "buildArenaInfos", (returns: any) => invalidRequestCreation);
        chai.spy.on(gameManagerService, "init2DArena", () => {
            gameManagerService["arenas[0]"].timer.stopTimer();
        });
        const spy: any = chai.spy.on(gameManagerService["assetManager"], "copyFileToTemp");

        await gameManagerService.analyseRequest(invalidRequestCreation);
        chai.expect(spy).to.throw();
        chai.spy.restore();

    });
    it("should delete the temp images if we delete the last arena alive", () => {
        userManagerService.validateName(request2DSimple.username);
        mockAxios.onGet(iArenaInfos.dataUrl.original, {
            responseType: "arraybuffer",
        }).reply(200, original);

        mockAxios.onGet(iArenaInfos.dataUrl.difference, {
            responseType: "arraybuffer",
        }).reply(200, modified);

        chai.spy.on(gameManagerService["interfaceBuilder"], "buildArenaInfos", (returns: any) => iArenaInfos);
        chai.spy.on(gameManagerService["assetManager"], ["tempRoutine2d"], () => {return; });
        chai.spy.on(gameManagerService, "init2DArena", () => {});
        const spy: any = chai.spy.on(gameManagerService["assetManager"], "deleteFileInTemp", () => {});
        chai.spy.on(gameManagerService["gameIdByArenaId"], "get", () => 1);
        chai.spy.on(gameManagerService["assetManager"], "getCounter", () => 1);

        gameManagerService.analyseRequest(request2DSimple).catch();
        gameManagerService.deleteArena(iArenaInfos);
        chai.expect(spy).to.have.been.called();
        chai.spy.restore();

    });
    it("should decrement the arenaAliveCount when deleting arena", () => {
        userManagerService.validateName(request2DSimple.username);
        mockAxios.onGet(iArenaInfos.dataUrl.original, {
            responseType: "arraybuffer",
        }).reply(200, original);

        mockAxios.onGet(iArenaInfos.dataUrl.difference, {
            responseType: "arraybuffer",
        }).reply(200, modified);

        chai.spy.on(gameManagerService["interfaceBuilder"], "buildArenaInfos", (returns: any) => iArenaInfos);
        chai.spy.on(gameManagerService["assetManager"], "copyFileToTemp", () => {return; });
        chai.spy.on(gameManagerService, "init2DArena", () => {});
        chai.spy.on(gameManagerService, ["deleteTempFiles"], () => {});
        chai.spy.on(gameManagerService["gameIdByArenaId"], "get", () => 1);

        gameManagerService.analyseRequest(request2DSimple).catch();
        gameManagerService.analyseRequest(request2DSimple).catch();
        gameManagerService.deleteArena(iArenaInfos);
        chai.expect(gameManagerService["assetManager"].getCounter(1)).to.equal(1);
        chai.spy.restore();

    });

    it("should make player ready when game is loaded", () => {
        const arena: Arena2D = new Arena2D(iArenaInfos, gameManagerService);
        chai.spy.on(gameManagerService["arenas"], "get", () => arena);
        const spy: any = chai.spy.on(arena, "onPlayerReady", () => {return; });
        gameManagerService.onGameLoaded("12345",1);
        chai.expect(spy).to.have.been.called();
    });

    it("should not make player ready if arena doesnt exist", () => {
        const arena: Arena2D = new Arena2D(iArenaInfos, gameManagerService);
        chai.spy.on(gameManagerService["arenas"], "get", () => undefined);
        const spy: any = chai.spy.on(arena, "onPlayerReady", () => {return; });
        gameManagerService.onGameLoaded("12345",1);
        chai.expect(spy).to.not.have.been.called();
    });


});
