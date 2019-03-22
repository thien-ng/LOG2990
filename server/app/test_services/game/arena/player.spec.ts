import "reflect-metadata";

import { expect } from "chai";
import { IUser } from "../../../../../common/communication/iUser";
import { Player } from "../../../services/game/arena/player";

// tslint:disable:no-magic-numbers

const user: IUser = {
    username: "Ettore Merlo",
    socketID: "666",
};
let player: Player;

beforeEach(() => {
    player = new Player(user);
});

describe("Player tests", () => {

    it("should create an instance of a Player", () => {
        expect(new Player(user)).instanceOf(Player);
    });

    it("should return 0 when getting point before adding them", () => {
        expect(player.getPoints()).to.equal(0);
    });

    it("should return 1 point after adding 1 point", () => {
        player.addPoints(1);
        expect(player.getPoints()).to.equal(1);
    });

    it("should return the player's socket ID", () => {
        expect(player.getUserSocketId()).to.equal("666");
    });

    it("should return the player's username", () => {
        expect(player.getUsername()).to.equal("Ettore Merlo");
    });

    it("should set to false value of penalty", () => {
        player.setPenaltyState(false);
        expect(player.getPenaltyState()).to.equal(false);
    });

    it("should set to true value of penalty", () => {
        player.setPenaltyState(true);
        expect(player.getPenaltyState()).to.equal(true);
    });

});
