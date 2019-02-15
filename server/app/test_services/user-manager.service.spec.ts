import "reflect-metadata";

import { expect } from "chai";
import { User } from "../../../common/communication/iUser";
import { UserManagerService } from "../services/user-manager.service";

let userManagerService: UserManagerService;

beforeEach(() => {
    userManagerService = new UserManagerService;
    userManagerService.users.push({
                                                username: "patate",
                                                socketID: "socketid",
                                            });
    userManagerService.users.push({
                                                username: "roger",
                                                socketID: "socketid",
                                            });
    userManagerService.users.push({
                                                username: "dylan",
                                                socketID: "socketid",
                                            });
});

describe("UserManagerService test", () => {

    it ("should return True if name input is unique", (done: Function) => {
        const user: User = {
                                username: "ligma",
                                socketID: "socketid",
                            };
        const result: Boolean = userManagerService.validateName(user.username);

        expect(result).to.equal(true);
        done();
    });

    it ("should return False if name input is not unique", (done: Function) => {
        const user: User = {
                                username: "patate",
                                socketID: "socketid",
                            };
        const result: Boolean = userManagerService.validateName(user.username);

        expect(result).to.equal(false);
        done();
    });

    it ("should return True if name input is unique", (done: Function) => {
        const name: string = "bob";
        const result: Boolean = userManagerService.isUnique(name);

        expect(result).to.equal(true);
        done();
    });

    it ("should return false if name input is unique", (done: Function) => {
        const name: string = "patate";
        const result: Boolean = userManagerService.isUnique(name);

        expect(result).to.equal(false);
        done();
    });

    it ("should return True if name is cleared from list properly", (done: Function) => {
        const user: User = {
                                username: "patate",
                                socketID: "socketid",
                            };
        userManagerService.leaveBrowser(user);

        const result: Boolean = userManagerService.isUnique(user.username);
        expect(result).to.equal(true);
        done();
    });

    it ("should return True if list was empty initially", (done: Function) => {
        const user: User = {
                                username: "patate",
                                socketID: "socketid",
                            };
        userManagerService.leaveBrowser(user);

        const result: Boolean = userManagerService.isUnique(user.username);
        expect(result).to.equal(true);
        done();
    });

});
