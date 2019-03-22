import { expect } from "chai";
import SocketIO = require("socket.io");
import { mock } from "ts-mockito";
import { Mode } from "../../../../common/communication/highscore";
import { GameMode } from "../../../../common/communication/iCard";
import { IGameRequest } from "../../../../common/communication/iGameRequest";
import { IUser } from "../../../../common/communication/iUser";
import { Message } from "../../../../common/communication/message";
import { CCommon } from "../../../../common/constantes/cCommon";
import { LobbyManagerService } from "../../services/game/lobby-manager.service";

// tslint:disable: no-unused-expression no-magic-numbers

let lobbyManagerService: LobbyManagerService;
let server:              SocketIO.Server;

const user1: IUser = {
    username: "michel",
    socketID: "sdfghd",
};

const user2: IUser = {
    username: "Rudolf",
    socketID: "q1234567",
};

const user3: IUser = {
    username: "Frank",
    socketID: "874dfghy",
};

const user4: IUser = {
    username: "Franky",
    socketID: "874dfghsdfgvcsy",
};

beforeEach(() => {
    server = mock(SocketIO);
    lobbyManagerService = new LobbyManagerService();

    lobbyManagerService["lobby"].set(1, [user1]);
    lobbyManagerService["lobby"].set(2, [user2]);
    lobbyManagerService["lobby"].set(3, [user3]);
});

describe("LobbyManagerService tests", () => {

    it("Should return the right lobby", () => {
        expect(lobbyManagerService.getLobby(1)).to.deep.equal([user1]);
    });

    it("Should return undefined if the lobby doesnt exist", () => {
        expect(lobbyManagerService.getLobby(6)).to.deep.equal(undefined);
    });

    it("Should delete the right lobby", () => {
        expect(lobbyManagerService.deleteLobby(1)).to.be.true;
    });

    it("Should return false if the lobby to be deleted is not existant", () => {
        expect(lobbyManagerService.deleteLobby(6)).to.be.false;
    });

    it("Should set the socket server", () => {
        lobbyManagerService.setServer(server);

        expect(lobbyManagerService["server"]).to.deep.equal(server);
    });

    it("Should return a list of active lobby", () => {
        const activeLobbyIDs: number[] = lobbyManagerService.getActiveLobby();
        const expectedList:   number[] = [1, 2, 3];

        expect(activeLobbyIDs).to.deep.equal(expectedList);
    });

    it("Should return a lobby event with the lobby id that was deleted", () => {
        expect(lobbyManagerService.removePlayerFromLobby("michel").gameID).to.be.equal(1);
    });

    it("Should return a lobby event with id 0 because no lobby existed with the username", () => {
        expect(lobbyManagerService.removePlayerFromLobby("qrtyhbvcdrty").gameID).to.be.equal(0);
    });

    it("Should create a new lobby when no lobby exists for the gameID", () => {
        lobbyManagerService.setServer(server);

        const expectedMessage: Message = {
            title: CCommon.ON_WAITING,
            body: "4",
        };
        const request: IGameRequest = {
            username:   "Franky",
            gameId:     4,
            type:       Mode.Multiplayer,
            mode:       GameMode.free,
        };

        expect(lobbyManagerService.verifyLobby(request, user4)).to.deep.equal(expectedMessage);
    });

    it("Should create a new lobby when no lobby exists for the gameID", () => {
        lobbyManagerService.setServer(server);

        const expectedMessage: Message = {
            title: CCommon.ON_SUCCESS,
            body: "1",
        };

        const request: IGameRequest = {
            username:   "Franky",
            gameId:     1,
            type:       Mode.Multiplayer,
            mode:       GameMode.free,
        };

        expect(lobbyManagerService.verifyLobby(request, user4)).to.deep.equal(expectedMessage);
    });
});
