import "reflect-metadata";

import * as chai from "chai";
import { IUser } from "../../../common/communication/iUser";
import { Message } from "../../../common/communication/message";
import { CServer } from "../CServer";
import { UserManagerService } from "../services/user-manager.service";

// tslint:disable:no-magic-numbers no-any

let userManagerService: UserManagerService;
let   mockAxios:        any;
const axios:            any     = require("axios");
const mockAdapter:      any     = require("axios-mock-adapter");

beforeEach(() => {
    userManagerService = new UserManagerService;
    mockAxios          = new mockAdapter.default(axios);

    userManagerService.users.push({
        username:       "patate",
        socketID:       "socketid",
    });

    userManagerService.users.push({
        username:       "roger",
        socketID:       "socketid",
    });

    userManagerService.users.push({
        username:       "dylan",
        socketID:       "socketid",
    });
});

afterEach(() => {
    mockAxios.restore();
});

describe("UserManagerService test", () => {

    it ("should return True if name input is unique", async () => {
        const user: IUser = {
            username:       "ligma",
            socketID:       "socketid",
        };

        mockAxios.onGet(CServer.PROFILE_PIC_GEN_PATH)
        .reply(200, Buffer.from("asdfgh"));

        chai.spy.on(userManagerService["assetManager"], "stockImage", () => { return; });

        const result: Message = await userManagerService.validateName(user.username);

        chai.expect(result.body).to.equal("isUnique");
    });

    it ("should return False if name input is not unique", async () => {
        const user: IUser = {
            username:       "patate",
            socketID:       "socketid",
        };

        mockAxios.onGet(CServer.PROFILE_PIC_GEN_PATH)
        .reply(200, Buffer.from("asdfgh"));

        const result: Message = await userManagerService.validateName(user.username);

        chai.expect(result.body).to.equal("isNotUnique");
    });

    it ("should return error of name lenght if name is too short", async () => {
        const testString:       string  = "143";

        const resultExpected:   Message = {
            title:          "onError",
            body:           "Le nom doit contenir entre 4 et 15 characteres",
        };

        mockAxios.onGet(CServer.PROFILE_PIC_GEN_PATH)
        .reply(200, Buffer.from("asdfgh"));

        const result: Message = await userManagerService.validateName(testString);

        chai.expect(result).to.deep.equal(resultExpected);
    });

    it ("should return error of name lenght if name is too long", async () => {
        const testString:       string  = "14adadawdadawdawdadadawdadaddwadad3";

        const resultExpected:   Message = {
            title:          "onError",
            body:           CServer.NAME_FORMAT_LENGTH_ERROR,
        };

        mockAxios.onGet(CServer.PROFILE_PIC_GEN_PATH)
        .reply(200, Buffer.from("asdfgh"));

        const result: Message = await userManagerService.validateName(testString);

        chai.expect(result).to.deep.equal(resultExpected);
    });

    it ("should return error of name regex format if name contains non alphanumeric character", async () => {
        const testString:       string  = "bob123;";

        const resultExpected:   Message = {
            title:          "onError",
            body:           CServer.USER_NAME_ERROR,
        };
        const result: Message = await userManagerService.validateName(testString);

        mockAxios.onGet(CServer.PROFILE_PIC_GEN_PATH)
        .reply(200, Buffer.from("asdfgh"));

        chai.expect(result).to.deep.equal(resultExpected);
    });

    it ("should return True if name input is unique", (done: Function) => {
        const name:     string              = "bob";
        const result:   Boolean | Message   = userManagerService.isUnique(name);

        chai.expect(result).to.equal(true);
        done();
    });

    it ("should return false if name input is unique", (done: Function) => {
        const name:     string  = "patate";
        const result:   Boolean = userManagerService.isUnique(name);

        chai.expect(result).to.equal(false);
        done();
    });

    it ("should return True if name is cleared from list properly", (done: Function) => {
        const user: IUser = {
            username:       "patate",
            socketID:       "socketid",
        };

        userManagerService.leaveBrowser(user);

        const result: Boolean = userManagerService.isUnique(user.username);
        chai.expect(result).to.equal(true);
        done();
    });

    it ("should return True if list was empty initially", (done: Function) => {
        const user: IUser = {
            username:       "patate",
            socketID:       "socketid",
        };

        userManagerService.leaveBrowser(user);

        const result: Boolean = userManagerService.isUnique(user.username);
        chai.expect(result).to.equal(true);
        done();
    });

    it ("should update the socket ID to the corresponding username", () => {
        const user: IUser = {
            username:       "patate",
            socketID:       "socketid",
        };

        const userToUpdate: IUser = {
            username:       "patate",
            socketID:       "socketidtoUpdate",
        };

        userManagerService.users.push(user);
        userManagerService.updateSocketID(userToUpdate);
        chai.expect(userManagerService.users[0]).to.deep.equal(userToUpdate);
    });
    it ("should update the username to the corresponding SocketID", () => {
        const user: IUser = {
            username:       "username",
            socketID:       "socketid",
        };

        const userToUpdate: IUser = {
            username:       "usernameToUpdate",
            socketID:       "socketid",
        };

        userManagerService.users.push(user);
        userManagerService.updateSocketID(userToUpdate);
        chai.expect(userManagerService.users[0]).to.deep.equal(userToUpdate);
    });

    it ("should get user by username", () => {
        const user: IUser = {
            username:       "patate",
            socketID:       "socketid",
        };

        const result: IUser | string = userManagerService.getUserByUsername("patate");
        chai.expect(result).to.deep.equal(user);
    });
});
