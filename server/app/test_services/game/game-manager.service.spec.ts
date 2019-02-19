import "reflect-metadata";

import { expect } from "chai";
import { GameMode } from "../../../../common/communication/iCard";
import { GameType, IGameRequest } from "../../../../common/communication/iGameRequest";
import { Message } from "../../../../common/communication/message";
import { GameManagerService } from "../../services/game/game-manager.service";
import { UserManagerService } from "../../services/user-manager.service";

let gameManagerService: GameManagerService;
let userManagerService: UserManagerService;

const request2D: IGameRequest = {
    username: "Frank",
    gameId: 100,
    type: GameType.singlePlayer,
    mode: GameMode.simple,
};

const request3D: IGameRequest = {
    username: "Franky",
    gameId: 105,
    type: GameType.singlePlayer,
    mode: GameMode.free,
};

const invalidRequest: IGameRequest = {
    username: "Frankette",
    gameId: 103,
    type: GameType.singlePlayer,
    mode: GameMode.invalid,
};

beforeEach(() => {
    userManagerService = new UserManagerService();
    gameManagerService = new GameManagerService(userManagerService);
});

describe("GameManagerService tests", () => {

    it("should add socketID in playerList", () => {

        gameManagerService.subscribeSocketID("dylan");
        const result: string = gameManagerService.userList[0];
        expect(result).to.be.equal("dylan");
    });

    it("should remove socketID in playerList", () => {

        gameManagerService.subscribeSocketID("dylan");
        gameManagerService.subscribeSocketID("michelGagnon");
        gameManagerService.unsubscribeSocketID("dylan");
        const result: string = gameManagerService.userList[0];
        expect(result).to.be.equal("michelGagnon");
    });

    it("Should return a success message when creating a 2D arena", () => {
        const answer: Message = gameManagerService.analyseRequest(request2D);
        expect(answer.title).deep.equal("onSuccess");
    });

    it("Should return a success message when creating a 3D arena", () => {
        const answer: Message = gameManagerService.analyseRequest(request3D);
        expect(answer.title).deep.equal("onSuccess");
    });

    it("Should return an error message when loading an invalid game", () => {
        const answer: Message = gameManagerService.analyseRequest(invalidRequest);
        expect(answer.title).deep.equal("onError");
    });

});
