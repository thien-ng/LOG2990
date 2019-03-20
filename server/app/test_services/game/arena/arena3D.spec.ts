import { AxiosInstance } from "axios";
import * as MockAdapter from "axios-mock-adapter";
import * as chai from "chai";
import * as spies from "chai-spies";
import * as fs from "fs";
import * as path from "path";
import { anything, mock, when } from "ts-mockito";
import { GameMode } from "../../../../../common/communication/iCard";
import { ActionType, IArenaResponse, ISceneObjectUpdate } from "../../../../../common/communication/iGameplay";
import { ISceneObject } from "../../../../../common/communication/iSceneObject";
import { IModification, ISceneData, ISceneVariables } from "../../../../../common/communication/iSceneVariables";
import { IUser } from "../../../../../common/communication/iUser";
import { Arena3D } from "../../../services/game/arena/arena3d";
import { I3DInfos, IArenaInfos, IPlayerInput } from "../../../services/game/arena/interfaces";
import { Referee } from "../../../services/game/arena/referee";
import { GameManagerService } from "../../../services/game/game-manager.service";

// tslint:disable:no-any no-magic-numbers no-floating-promises

const axios: AxiosInstance = require("axios");
let mockAxios: any;
let arena: Arena3D;
let gameManagerService: GameManagerService;

const activeUser: IUser = {
    username: "mike",
    socketID: "123",
 };

const arenaInfo: IArenaInfos<I3DInfos> = {
    arenaId:    1,
    users:      [activeUser],
    dataUrl:    {
        sceneData: "http://localhost:3000/scene/2_scene.json",
    },
};

const sceneObject: ISceneObject = {
    id:         1,
    type:       1,
    position:   {x: 1, y: 2, z: 3},
    rotation:   {x: 1, y: 2, z: 3},
    color:      "#FFFFFF",
    scale:      {x: 1, y: 2, z: 3},
    hidden:     true,
};

const sceneVariables: ISceneVariables = {
    theme:                  1,
    gameName:               "fokoffMichael",
    sceneObjectsQuantity:   5,
    sceneObjects:           [sceneObject],
    sceneBackgroundColor:   "#FFFFFF",
};

const sceneData: ISceneData = {
    originalScene: sceneVariables,
    modifiedScene: sceneVariables,
    modifications: [{id: 1, type: 6}],
};

const refereeResponse: IArenaResponse<ISceneObjectUpdate> = {
    status:             "onSuccess",
    response: {
        actionToApply:  ActionType.ADD,
        sceneObject:    sceneObject,
    },
    arenaType:          GameMode.free,
};

const playerInput: IPlayerInput<number> = {
    event:      "onClick",
    arenaId:    1,
    user:       activeUser,
    eventInfo:  1,
};

const testSceneBuffer: Buffer = fs.readFileSync(path.resolve(__dirname, "../../../asset/scene/2_scene.json"));

describe("Arena3D tests", () => {

    beforeEach(async () => {
        chai.use(spies);
        gameManagerService  = mock(GameManagerService);
        mockAxios           = new MockAdapter.default(axios);
        arena               = new Arena3D(arenaInfo, gameManagerService);
    });

    afterEach(() => {
        mockAxios.restore();
    });

    it("should call referee onPlayerClick method", async () => {
        const referee: any  = mock(Referee);
        arena["referee"]    = referee;
        const spy: any      = chai.spy.on(arena["referee"], "onPlayerClick");

        when(referee.onPlayerClick(anything(), anything())).thenReturn(refereeResponse);

        arena.onPlayerClick(75, activeUser).then(() => {
            chai.expect(spy).called();
        }).catch();
    });

    it("should call referee validateHit method", async () => {
        const referee: any  = mock(Referee);
        arena["referee"]    = referee;
        const spy: any      = chai.spy.on(arena["referee"], "validateHit");

        when(referee.onPlayerClick(anything(), anything())).thenReturn(refereeResponse);

        arena.validateHit(75).then(() => {
            chai.expect(spy).called();
        }).catch();
    });

    it("should call return failed click response", async () => {

        playerInput.event = "notAClickMyBoi";

        const arenaResponse: IArenaResponse<ISceneObjectUpdate> = {
            status: "onFailedClick",
        };

        arena.onPlayerInput(playerInput).then((response: IArenaResponse<ISceneObjectUpdate>) => {
            chai.expect(response).to.deep.equal(arenaResponse);
        }).catch();

        playerInput.event = "onClick";
    });

    it("should call referee validateHit method when onPlayerInput", async () => {
        const referee: any  = mock(Referee);
        arena["referee"]    = referee;
        const spy: any      = chai.spy.on(arena["referee"], "onPlayerClick");

        when(referee.onPlayerClick(anything(), anything())).thenReturn(refereeResponse);

        arena.onPlayerInput(playerInput).then(() => {
            chai.expect(spy).called();
        }).catch();
    });

    it("should prepare a new arena successfully", async () => {

        const spy: any  = chai.spy.on(arena, "extractModifiedSceneObjects");

        mockAxios.onGet(arenaInfo.dataUrl.sceneData, {
            responseType: "arraybuffer",
        })
        .reply(200, testSceneBuffer);

        arena.prepareArenaForGameplay();

        chai.expect(spy).called();
    });

    it("should prepare throw error when getting scene.json", async () => {

        const spy: any  = chai.spy.on(arena, "extractModifiedSceneObjects");

        mockAxios.onGet(arenaInfo.dataUrl.sceneData, {
            responseType: "arraybuffer",
        })
        .reply(400);

        arena.prepareArenaForGameplay().then().catch((error: any) => {
            chai.expect(error.message).to.equal("Didn't succeed to get image buffer from URL given. File: arena.ts.");
        });

        chai.expect(spy).called();
    });

    it("should return scene object to update with no action required", async () => {

        const modification: IModification = {
            id: 1,
            type: 6,
        };

        const result: any = arena["findObjectToUpdate"](modification, sceneData);

        chai.expect(result).to.deep.equal({ actionToApply: 3, sceneObject: undefined });
    });

});
