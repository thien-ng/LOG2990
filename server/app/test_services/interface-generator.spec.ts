import { expect } from "chai";
import { ILobbyEvent, MultiplayerButtonText } from "../../../common/communication/iCard";
import { Message } from "../../../common/communication/message";
import { InterfaceBuilder } from "../../app/services/interface-generator";
import { Constants } from "../constants";
import { CCommon } from "../../../common/constantes/cCommon";
import { IArenaInfos, I2DInfos } from "../services/game/arena/interfaces";
import { IUser } from "../../../common/communication/iUser";

describe("interface-generator tests", () => {
    let interfaceBuilder: InterfaceBuilder;

    beforeEach( () => {
        interfaceBuilder = new InterfaceBuilder();
    });

    it("should build a Message when calling buildMessage()", () => {
        const expectedMessage: Message = {
            title:  "MessageBonjour",
            body:   "allo",
        };

        const resultMessage: Message = interfaceBuilder.buildMessage("MessageBonjour", "allo");
        expect(resultMessage).to.not.equal(expectedMessage);

    });

    it("should return a LobbyEvent interface when calling buildLobbyEvent()", () => {
        const expectedILobbyEvent: ILobbyEvent = {
            gameID:  1,
            buttonText:   MultiplayerButtonText.create,
        };

        const resultILobbyEvent: ILobbyEvent = interfaceBuilder.buildLobbyEvent(1, MultiplayerButtonText.create);
        expect(resultILobbyEvent).to.not.equal(expectedILobbyEvent);

    });

    it("should return IArenaInfos<I2DInfos> when calling buildArena2DInfos()", () => {
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

        const expectedIArenaInfos: IArenaInfos<I2DInfos> = {
            arenaId:            11,
            users:              usersMock,
            dataUrl: {
                original:   Constants.PATH_SERVER_TEMP + 2 + CCommon.ORIGINAL_FILE,
                difference: Constants.PATH_SERVER_TEMP + 2 + Constants.GENERATED_FILE,
            },
        };

        const resultIArenaInfos: IArenaInfos<I2DInfos> = interfaceBuilder.buildArena2DInfos(usersMock, 2, 11);
        expect(resultIArenaInfos).deep.equal(expectedIArenaInfos);

    });

});