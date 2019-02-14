import "reflect-metadata";

import { expect } from "chai";
import { User } from "../../../../common/communication/iUser";
import { NameValidatorService } from "../../services/validator/nameValidator.service";

let nameValidatorService: NameValidatorService;

beforeEach(() => {
    nameValidatorService = new NameValidatorService;
    nameValidatorService.usernameList.push({
                                                username: "patate",
                                                socketID: "socketid",
                                            });
    nameValidatorService.usernameList.push({
                                                username: "roger",
                                                socketID: "socketid",
                                            });
    nameValidatorService.usernameList.push({
                                                username: "dylan",
                                                socketID: "socketid",
                                            });
});

describe("NameValidatorService test", () => {

    it ("should return True if name input is unique", (done: Function) => {
        const user: User = {
                                username: "ligma",
                                socketID: "socketid",
                            };
        const result: Boolean = nameValidatorService.validateName(user);

        expect(result).to.equal(true);
        done();
    });

    it ("should return False if name input is not unique", (done: Function) => {
        const user: User = {
                                username: "patate",
                                socketID: "socketid",
                            };
        const result: Boolean = nameValidatorService.validateName(user);

        expect(result).to.equal(false);
        done();
    });

    it ("should return True if name input is unique", (done: Function) => {
        const name: string = "bob";
        const result: Boolean = nameValidatorService.isUnique(name);

        expect(result).to.equal(true);
        done();
    });

    it ("should return false if name input is unique", (done: Function) => {
        const name: string = "patate";
        const result: Boolean = nameValidatorService.isUnique(name);

        expect(result).to.equal(false);
        done();
    });

    it ("should return True if name is cleared from list properly", (done: Function) => {
        const user: User = {
                                username: "patate",
                                socketID: "socketid",
                            };
        nameValidatorService.leaveBrowser(user);

        const result: Boolean = nameValidatorService.isUnique(user.username);
        expect(result).to.equal(true);
        done();
    });

    it ("should return True if list was empty initially", (done: Function) => {
        const user: User = {
                                username: "patate",
                                socketID: "socketid",
                            };
        nameValidatorService.leaveBrowser(user);

        const result: Boolean = nameValidatorService.isUnique(user.username);
        expect(result).to.equal(true);
        done();
    });

});
