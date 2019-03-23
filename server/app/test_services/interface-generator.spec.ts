import { expect } from "chai";
import { ILobbyEvent, MultiplayerButtonText } from "../../../common/communication/iCard";
import { Message } from "../../../common/communication/message";
import { InterfaceBuilder } from "../../app/services/interface-generator";

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

});