import { expect } from "chai";
import "reflect-metadata";
import { GameManager } from "../../services/game/game-manager.service";

let gameManager: GameManager;
beforeEach(() => {
    gameManager = new GameManager();
});

describe("GameManager tests", () => {
    
    it("should add socketID in playerList", () => {
        
        gameManager.subscribeSocketID("dylan");
        const result: string = gameManager.getPlayerList()[0];
        expect(result).to.be.equal("dylan");
    });

    it("should remove socketID in playerList", () => {
        
        gameManager.subscribeSocketID("dylan");
        gameManager.subscribeSocketID("michelGagnon");
        gameManager.unsubscribeSocketID("dylan");
        const result: string = gameManager.getPlayerList()[0];
        expect(result).to.be.equal("michelGagnon");
    });

});
