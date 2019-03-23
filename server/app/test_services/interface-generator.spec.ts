import { expect } from "chai";
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
});