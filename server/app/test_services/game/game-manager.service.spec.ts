import { expect } from "chai";
import "reflect-metadata";
import { GameManagerService } from "../../services/game/game-manager.service";

let gameManagerService: GameManagerService;
beforeEach(() => {
    gameManagerService = new GameManagerService();
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

});
