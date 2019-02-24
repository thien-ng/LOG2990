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
        expect(player.points).to.equal(0);
    });
});
