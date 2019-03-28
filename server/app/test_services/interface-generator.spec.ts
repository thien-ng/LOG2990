import { expect } from "chai";
import { ILobbyEvent, MultiplayerButtonText } from "../../../common/communication/iCard";
import { IUser } from "../../../common/communication/iUser";
import { Message } from "../../../common/communication/message";
import { CCommon } from "../../../common/constantes/cCommon";
import { InterfaceBuilder } from "../../app/services/interface-generator";
import { CServer } from "../CServer";
import { I2DInfos, I3DInfos, IArenaInfos } from "../services/game/arena/interfaces";

// tslint:disable:no-magic-numbers

describe("Interface-generator tests", () => {
    let interfaceBuilder: InterfaceBuilder;

    const usersMock: IUser[] = [
        {
            username: "gaby",
            socketID: "14",
        },
        {
            username: "arthy",
            socketID: "15",
        },
    ];

    beforeEach( () => {
        interfaceBuilder = new InterfaceBuilder();
    });

    it("should return Message when calling buildMessage()", () => {
        const expectedMessage: Message = {
            title:  "MessageBonjour",
            body:   "allo",
        };

        const resultMessage: Message = interfaceBuilder.buildMessage("MessageBonjour", "allo");
        expect(resultMessage).deep.equal(expectedMessage);

    });

    it("should return ILobbyEvent when calling buildLobbyEvent()", () => {
        const expectedILobbyEvent: ILobbyEvent = {
            gameID:         1,
            buttonText:     MultiplayerButtonText.create,
        };

        const resultILobbyEvent: ILobbyEvent = interfaceBuilder.buildLobbyEvent(1, MultiplayerButtonText.create);
        expect(resultILobbyEvent).deep.equal(expectedILobbyEvent);

    });

    it("should return IArenaInfos<I2DInfos> when calling buildArena2DInfos()", () => {
        const expectedIArenaInfos: IArenaInfos<I2DInfos> = {
            arenaId:            11,
            users:              usersMock,
            dataUrl: {
                original:   CServer.PATH_SERVER_TEMP + 2 + CCommon.ORIGINAL_FILE,
                difference: CServer.PATH_SERVER_TEMP + 2 + CServer.GENERATED_FILE,
            },
        };

        const resultIArenaInfos: IArenaInfos<I2DInfos> = interfaceBuilder.buildArena2DInfos(usersMock, 2, 11);
        expect(resultIArenaInfos).deep.equal(expectedIArenaInfos);

    });

    it("should return IArenaInfos<I3DInfos> when calling buildArena3DInfos()", () => {
        const expectedIArenaInfos: IArenaInfos<I3DInfos> = {
            arenaId:            11,
            users:              usersMock,
            dataUrl: {
                sceneData:  CServer.PATH_SERVER_TEMP + 2 + CCommon.SCENE_FILE,
            },
        };

        const resultIArenaInfos: IArenaInfos<I3DInfos> = interfaceBuilder.buildArena3DInfos(usersMock, 2, 11);
        expect(resultIArenaInfos).deep.equal(expectedIArenaInfos);

    });

    it("should return IUser when calling builIUser()", () => {
        const expectedIUser: IUser = {
            username: "jerry",
            socketID: "2",
        };

        const resultIUser: IUser = interfaceBuilder.buildIUser("jerry", "2");
        expect(resultIUser).deep.equal(expectedIUser);

    });

});
