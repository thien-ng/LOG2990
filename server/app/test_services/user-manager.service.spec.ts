import "reflect-metadata";

import { expect } from "chai";
import { User } from "../../../common/communication/iUser";
import { Message } from "../../../common/communication/message";
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
        const result: Message = userManagerService.validateName(user.username);

        expect(result.body).to.equal("true");
        done();
    });

    it ("should return False if name input is not unique", (done: Function) => {
        const user: User = {
                                username: "patate",
                                socketID: "socketid",
                            };
        const result: Message = userManagerService.validateName(user.username);

        expect(result.body).to.equal("false");
        done();
    });

    it ("should return error of name lenght if name is too short", (done: Function) => {
        const testString: string = "143";
        const resultExpected: Message = {
            title: "onError",
            body: "Le nom doit contenir entre 4 et 15 characteres",
        };
        const result: Message = userManagerService.validateName(testString);

        expect(result).to.deep.equal(resultExpected);
        done();
    });

    it ("should return error of name lenght if name is too long", (done: Function) => {
        const testString: string = "14adadawdadawdawdadadawdadaddwadad3";
        const resultExpected: Message = {
            title: "onError",
            body: "Le nom doit contenir entre 4 et 15 characteres",
        };
        const result: Message = userManagerService.validateName(testString);

        expect(result).to.deep.equal(resultExpected);
        done();
    });

    it ("should return error of name regex format if name contains non alphanumeric character", (done: Function) => {
        const testString: string = "bob123;";
        const resultExpected: Message = {
            title: "onError",
            body: "Le nom doit contenir seulement des caracteres alphanumerics",
        };
        const result: Message = userManagerService.validateName(testString);

        expect(result).to.deep.equal(resultExpected);
        done();
    });

    it ("should return True if name input is unique", (done: Function) => {
        const name: string = "bob";
        const result: Boolean | Message = userManagerService.isUnique(name);

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

    it ("should update the socket ID to the corresponding username", () => {
        const user: User = {
                                username: "patate",
                                socketID: "socketid",
                            };
        const userToUpdate: User = {
                                username: "patate",
                                socketID: "socketidtoUpdate",
                            };
        userManagerService.users.push(user);
        userManagerService.updateSocketID(userToUpdate);
        expect(userManagerService.users[0]).to.deep.equal(userToUpdate);
    });
    it ("should update the username to the corresponding SocketID", () => {
        const user: User = {
                                username: "username",
                                socketID: "socketid",
                            };
        const userToUpdate: User = {
                                username: "usernameToUpdate",
                                socketID: "socketid",
                            };
        userManagerService.users.push(user);
        userManagerService.updateSocketID(userToUpdate);
        expect(userManagerService.users[0]).to.deep.equal(userToUpdate);
    });

    it ("should update the username to the corresponding SocketID", () => {
        const user: User = {
                                username: "patate",
                                socketID: "socketid",
                            };
        const result: User | string = userManagerService.getUserByUsername("patate");
        expect(result).to.deep.equal(user);
    });
});
