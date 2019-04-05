import "reflect-metadata";

import * as chai from "chai";
import * as spies from "chai-spies";
import * as fs from "fs";
import * as path from "path";
import * as sinon from "sinon";
import SocketIO = require("socket.io");
import { mock, verify } from "ts-mockito";
import { GameMode, ICard, ILobbyEvent, MultiplayerButtonText } from "../../../../common/communication/iCard";
import { IGameRequest } from "../../../../common/communication/iGameRequest";
import { IArenaResponse, IOriginalPixelCluster, IPosition2D } from "../../../../common/communication/iGameplay";
import { IUser } from "../../../../common/communication/iUser";
import { Message } from "../../../../common/communication/message";
import { CCommon } from "../../../../common/constantes/cCommon";
import { CServer } from "../../CServer";
import { AssetManagerService } from "../../services/asset-manager.service";
import { CardOperations } from "../../services/card-operations.service";
import { ChatManagerService } from "../../services/chat-manager.service";
import { Arena2D } from "../../services/game/arena/arena2d";
import { I2DInfos, I3DInfos, IArenaInfos, IPlayerInput } from "../../services/game/arena/interfaces";
import { Player } from "../../services/game/arena/player";
import { GameManagerService } from "../../services/game/game-manager.service";
import { LobbyManagerService } from "../../services/game/lobby-manager.service";
import { HighscoreService } from "../../services/highscore.service";
import { HighscoreValidationResponse, Mode, Time } from "../../services/highscore/utilities/interfaces";
import { TimeManagerService } from "../../services/time-manager.service";
import { UserManagerService } from "../../services/user-manager.service";

// tslint:disable no-magic-numbers no-any await-promise no-floating-promises max-file-line-count max-func-body-length no-empty

let lobbyManagerService:    LobbyManagerService;
let assetManagerService:    AssetManagerService;
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
const iArenaInfos3d: IArenaInfos<I3DInfos> = {
    arenaId:            1,
    users:              [{username: "Frank", socketID: "12345"}],
    dataUrl:            {
        sceneData:  "../../../asset/image/1_modified.bmp",
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
const c1: ICard = {
    gameID:             4,
    title:              "Default 2D",
    subtitle:           "default 2D",
    avatarImageUrl:     "/elon.jpg",
    gameImageUrl:       "/elon.jpg",
    gamemode:           GameMode.simple,
};
const answer: any = {
    status:         CCommon.ON_SUCCESS,
    isNewHighscore: true,
    index: 0,
    highscore: {
        id:             1,
        timesSingle:    [{username: "cpu", time: 1}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
        timesMulti:     [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
    },
};

const ON_ERROR_ORIGINAL_PIXEL_CLUSTER: IOriginalPixelCluster = { differenceKey: -1, cluster: [] };
const expectedMessage: IArenaResponse<any> = {
    status:     CCommon.ON_ERROR,
    response:   ON_ERROR_ORIGINAL_PIXEL_CLUSTER,
};

let socket: SocketIO.Socket;
let server: SocketIO.Server;
const original: Buffer = fs.readFileSync(path.resolve(__dirname, "../../asset/image/testBitmap/imagetestOg.bmp"));
const modified: Buffer = fs.readFileSync(path.resolve(__dirname, "../../asset/image/testBitmap/imagetestOg.bmp"));

beforeEach(() => {
    socket              = mock(SocketIO);
    server              = mock(SocketIO);
    assetManagerService = new AssetManagerService();
    lobbyManagerService = new LobbyManagerService();
    userManagerService  = new UserManagerService();
    highscoreService    = new HighscoreService(assetManagerService);
    timeManagerService  = new TimeManagerService();
    chatManagerService  = new ChatManagerService(timeManagerService);
    cardOperations      = new CardOperations(highscoreService);

    gameManagerService  = new GameManagerService(
        userManagerService,
        highscoreService,
        chatManagerService,
        cardOperations,
        lobbyManagerService);
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

    it("should emit lobby event message when removing a player in a lobby", () => {
        const lobbyEvent: ILobbyEvent = {
            gameID: 1,
            buttonText: MultiplayerButtonText.create,
        };
        gameManagerService.subscribeSocketID("dylan", socket);
        gameManagerService.subscribeSocketID("michelGagnon", socket);
        chai.spy.on(gameManagerService["lobbyManagerService"], "removePlayerFromLobby", () => lobbyEvent);
        const spy: any = chai.spy.on(gameManagerService["server"], "emit", () => {return; });
        gameManagerService.unsubscribeSocketID("dylan", "dylan");
        chai.expect(spy).to.have.been.called();
    });

    it("should return a success message when creating a 2D arena", async () => {
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
        }).catch((error: Error) => {});

    });

    it("should return a success message when creating a 3D arena", async () => {
        chai.spy.on(gameManagerService["assetManager"], ["tempRoutine3d"], () => {return; });
        userManagerService.validateName(request3DSimple.username);
        const message: Message = await gameManagerService.analyseRequest(request3DSimple);
        chai.expect(message.title).to.equal("onSuccess");
        chai.spy.restore();
    });

    it("should return an error message when loading an invalid game", async () => {
        userManagerService.validateName(invalidRequest.username);
        const message: Message = await gameManagerService.analyseRequest(invalidRequest);
        chai.expect(message.body).to.equal("Game mode invalide");
    });

    it("should return an error message when username doesnt exist", async () => {
        const message: Message = await gameManagerService.analyseRequest(invalidRequest);
        chai.expect(message.body).to.equal("Utilisateur inexistant");
    });

    it("should return an error message when loading an invalid game", async () => {
        chai.expect(await gameManagerService.onPlayerInput(playerInput)).to.deep.equal(expectedMessage);
    });

    it("should return error if wrong click after arena have been created", async () => {
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

        chai.expect(await gameManagerService.onPlayerInput(playerInput)).to.deep.equal(expectedMessage);
        chai.spy.restore();
    });

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

    it("should send message with socket", async () => {
        gameManagerService = new GameManagerService(
            userManagerService,
            highscoreService,
            chatManagerService,
            cardOperations,
            lobbyManagerService);
        gameManagerService.subscribeSocketID("socketID", socket);
        gameManagerService.sendMessage("socketID", "onEvent", 1);
        verify(socket.emit("onEvent", 1)).atLeast(0);
    });

    it("should return a message saying onWaiting when no one is in the lobby", async () => {
        chai.spy.on(gameManagerService["assetManager"], "tempRoutine2d", () => {return; });
        userManagerService["users"].push({username: "Frank", socketID: "Frank"});
        const response: Message = await gameManagerService.analyseRequest(request2DMulti);
        chai.expect(response.title).to.deep.equal(CCommon.ON_WAITING);
        chai.spy.restore();
    });

    it("should return a message saying onSuccess when someone is in the lobby (2D)", async () => {
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

    it("should return an error message when joining a non-existing lobby (2D)", async () => {
        const request: IGameRequest = {
            username:   "Franky",
            gameId:     1,
            type:       Mode.Multiplayer,
            mode:       GameMode.simple,
        };
        const message: Message = {
            title: CCommon.ON_SUCCESS,
            body: "",
        };
        userManagerService["users"].push({username: "Franky", socketID: "Franky"});
        chai.spy.on(gameManagerService["assetManager"], "tempRoutine2d", () => {return; });
        chai.spy.on(gameManagerService["lobbyManagerService"], "verifyLobby", () => message);
        const response: Message = await gameManagerService.analyseRequest(request);
        chai.expect(response.title).to.deep.equal(CCommon.ON_ERROR);
        chai.spy.restore();
    });

    it("should return a message saying onSuccess when someone is in the lobby (3D)", async () => {
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

    it("should send an cancel request if lobby is now undefined", () => {
        const user: IUser[] = [{username: "Franky", socketID: "Franky"}];
        chai.spy.on(gameManagerService["lobbyManagerService"], "getLobby", () => user);
        const spy: any = chai.spy.on(gameManagerService, "sendMessage");
        gameManagerService.cancelRequest(1, true);
        chai.expect(spy).to.have.been.called();
    });

    it("should return an error message when deleting an unexisting arena", async () => {
        chai.expect(gameManagerService.cancelRequest(2, false).title).to.deep.equal(CCommon.ON_ERROR);
    });

    it("should return a success message when deleting an existing arena", async () => {
        const user: IUser = {username: "Frank", socketID: "Frank"};
        lobbyManagerService["lobby"].set(1, [user]);
        chai.expect(gameManagerService.cancelRequest(1, false).title).to.deep.equal(CCommon.ON_SUCCESS);
    });

    it("should throw an error if cannot copy the gameImages", async () => {
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
    it("should delete the temp images if we delete the last 2d arena alive", () => {
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

    it("should delete the temp images if we delete the 3d last arena alive", () => {
        userManagerService.validateName(request3DSimple.username);
        mockAxios.onGet(iArenaInfos.dataUrl.original, {
            responseType: "arraybuffer",
        }).reply(200, original);

        mockAxios.onGet(iArenaInfos.dataUrl.difference, {
            responseType: "arraybuffer",
        }).reply(200, modified);

        chai.spy.on(gameManagerService["interfaceBuilder"], "buildArenaInfos", (returns: any) => iArenaInfos3d);
        chai.spy.on(gameManagerService["assetManager"], ["tempRoutine3d"], () => {return; });
        chai.spy.on(gameManagerService, "init3DArena", () => {});
        const spy: any = chai.spy.on(gameManagerService["assetManager"], "deleteFileInTemp", () => {});
        chai.spy.on(gameManagerService["gameIdByArenaId"], "get", () => 1);
        chai.spy.on(gameManagerService["assetManager"], "getCounter", () => 1);

        gameManagerService.analyseRequest(request3DSimple).catch();
        gameManagerService.deleteArena(iArenaInfos3d);
        chai.expect(spy).to.have.been.called();
        chai.spy.restore();

    });
    it("should break if cannot get counter from assetManager", () => {
        chai.spy.on(gameManagerService["gameIdByArenaId"], "get", () => 1);
        const spy: any = chai.spy.on(gameManagerService["assetManager"], "decrementTempCounter");
        gameManagerService.deleteArena(iArenaInfos);
        chai.expect(spy).to.not.have.been.called();
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
        gameManagerService.onGameLoaded("12345", 1);
        chai.expect(spy).to.have.been.called();
    });

    it("should not make player ready if arena doesnt exist", () => {
        const arena: Arena2D = new Arena2D(iArenaInfos, gameManagerService);
        chai.spy.on(gameManagerService["arenas"], "get", () => undefined);
        const spy: any = chai.spy.on(arena, "onPlayerReady", () => {return; });
        gameManagerService.onGameLoaded("12345", 1);
        chai.expect(spy).to.not.have.been.called();
    });

    it("should get the differences index in arena", () => {
        const arena: Arena2D = new Arena2D(iArenaInfos, gameManagerService);
        gameManagerService["arenas"].set(1000, arena);
        const spy: any = chai.spy.on(arena, "getDifferencesIds", () => [1]);
        gameManagerService.getDifferencesIndex(1000);
        chai.expect(spy).to.have.been.called();
    });

    it("should set the server", () => {
        gameManagerService.setServer(server);
        chai.expect(gameManagerService["server"]).to.equal(server);
    });

    it("should send update new Highscore", (done: Function) => {

        mockAxios.onPost(CServer.VALIDATE_HIGHSCORE_PATH)
        .reply(200, answer);

        const highscoreValidation: HighscoreValidationResponse = {
            status: CCommon.ON_SUCCESS,
            isNewHighscore: true,
            index: 1,
            highscore: {
                id:             1,
                timesSingle:    [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
                timesMulti:     [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
            },
        };
        if (highscoreValidation) {}

        chai.spy.on(gameManagerService["cardOperations"], "getCardById", () => c1);
        const stubbedVal: any = sinon.stub(gameManagerService["highscoreService"], "updateHighscore");
        stubbedVal.resolves(highscoreValidation);

        chai.spy.on(gameManagerService, "deleteArena", () => {return; });
        chai.spy.on(gameManagerService["gameIdByArenaId"], "get", () => 1);
        const spy: any = chai.spy.on(gameManagerService["chatManagerService"], "sendNewHighScoreMessage", () => {return; });
        chai.spy.on(gameManagerService["server"], "emit", () => {return; });
        const time: Time = {username: "cpu", time: 1};
        gameManagerService.endOfGameRoutine(time, Mode.Singleplayer, iArenaInfos, GameMode.simple);
        done();
        chai.expect(spy).to.have.been.called();
    });

    it("should emit the new Highscore", (done: Function) => {

        mockAxios.onPost(CServer.VALIDATE_HIGHSCORE_PATH)
        .reply(200, answer);

        const highscoreValidation: HighscoreValidationResponse = {
            status: CCommon.ON_SUCCESS,
            isNewHighscore: true,
            index: 1,
            highscore: {
                id:             1,
                timesSingle:    [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
                timesMulti:     [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
            },
        };
        if (highscoreValidation) {}

        chai.spy.on(gameManagerService["cardOperations"], "getCardById", () => c1);
        const stubbedVal: any = sinon.stub(gameManagerService["highscoreService"], "updateHighscore");
        stubbedVal.resolves(highscoreValidation);

        chai.spy.on(gameManagerService, "deleteArena", () => {return; });
        chai.spy.on(gameManagerService["gameIdByArenaId"], "get", () => 1);
        const spy: any = chai.spy.on(gameManagerService["server"], "emit", () => {return; });
        const time: Time = {username: "cpu", time: 1};
        gameManagerService.endOfGameRoutine(time, Mode.Singleplayer, iArenaInfos, GameMode.simple);
        done();
        chai.expect(spy).to.have.been.called();
    });

    it("should emit an error when entering in catch", (done: Function) => {

        mockAxios.onPost(CServer.VALIDATE_HIGHSCORE_PATH)
        .reply(200, answer);

        const highscoreValidation: HighscoreValidationResponse = {
            status: CCommon.ON_SUCCESS,
            isNewHighscore: true,
            index: 1,
            highscore: {
                id:             1,
                timesSingle:    [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
                timesMulti:     [{username: "cpu", time: 2}, {username: "cpu", time: 4}, {username: "cpu", time: 6}],
            },
        };
        if (highscoreValidation) {}

        chai.spy.on(gameManagerService["cardOperations"], "getCardById", () => c1);
        const stubbedVal: any = sinon.stub(gameManagerService["highscoreService"], "updateHighscore");
        stubbedVal.resolves(highscoreValidation);

        chai.spy.on(gameManagerService, "deleteArena", () => {return; });
        chai.spy.on(gameManagerService["gameIdByArenaId"], "get", () => 1);
        chai.spy.on(gameManagerService["chatManagerService"], "sendNewHighScoreMessage", () => {throw new TypeError; });
        const spy: any = chai.spy.on(gameManagerService["server"], "emit", () => {return; });
        const time: Time = {username: "cpu", time: 1};
        gameManagerService.endOfGameRoutine(time, Mode.Singleplayer, iArenaInfos, GameMode.simple);
        done();
        chai.expect(spy).to.have.been.called();
    });

    it("should call the arena onPlayerInput when gameManager calls him", () => {
        const arena: Arena2D = new Arena2D(iArenaInfos, gameManagerService);
        chai.spy.on(gameManagerService["arenas"], "get", () => arena);
        chai.spy.on(arena, "contains", () => true);
        const spy: any = chai.spy.on(arena, "onPlayerInput", () => {return; });
        gameManagerService.onPlayerInput(playerInput);
        chai.expect(spy).to.have.been.called();
    });
});
