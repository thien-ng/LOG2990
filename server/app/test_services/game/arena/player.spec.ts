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
