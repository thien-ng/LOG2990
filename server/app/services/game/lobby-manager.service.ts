import { injectable } from "inversify";
import { ILobbyEvent, MultiplayerButtonText } from "../../../../common/communication/iCard";
import { IGameRequest } from "../../../../common/communication/iGameRequest";
import { IUser } from "../../../../common/communication/iUser";
import { Message } from "../../../../common/communication/message";
import { CCommon } from "../../../../common/constantes/cCommon";

@injectable()
export class LobbyManagerService {

    private lobby:  Map<number, IUser[]>;
    private server: SocketIO.Server;

    public constructor() {
        this.lobby = new Map<number, IUser[]>();
    }

    public getLobby(gameId: number): IUser[] | undefined {
        return this.lobby.get(gameId);
    }

    public deleteLobby(gameId: number): boolean {
        return this.lobby.delete(gameId);
    }

    public setServer(server: SocketIO.Server): void {
        this.server = server;
    }

    public getActiveLobby(): number[] {
        const lobbyList: number[] = [];
        this.lobby.forEach((value: IUser[], key: number) => {
            lobbyList.push(key);
        });

        return lobbyList;
    }

    public removePlayerFromLobby(username: string): ILobbyEvent {
        let gameID: number = 0;

        this.lobby.forEach((value: IUser[], key: number) => {
            if (value.some((user: IUser) => user.username === username)) {
                gameID = key;
            }
        });
        this.lobby.delete(gameID);

        return this.generateLobbyEvent(gameID, MultiplayerButtonText.create);
    }

    public verifyLobby(request: IGameRequest, user: IUser): Message {
        const lobby: IUser[] | undefined = this.lobby.get(request.gameId);

        if (lobby === undefined) {
            return this.newLobby(request, user);
        } else {
            lobby.push(user);

            return this.generateMessage(CCommon.ON_SUCCESS, request.gameId.toString());
        }
    }

    private newLobby(request: IGameRequest, user: IUser): Message {
        const lobbyEvent: ILobbyEvent = this.generateLobbyEvent(request.gameId, MultiplayerButtonText.join);

        this.lobby.set(request.gameId.valueOf(), [user]);
        this.server.emit(CCommon.ON_LOBBY, lobbyEvent);

        return this.generateMessage(CCommon.ON_WAITING, request.gameId.toString());
    }

    private generateMessage(title: string, body: string): Message {
        return {
            title: title,
            body: body,
        };
    }

    private generateLobbyEvent(gameID: number, buttonText: MultiplayerButtonText): ILobbyEvent {
        return {
            gameID:      gameID,
            buttonText: buttonText,
        };
    }
}
