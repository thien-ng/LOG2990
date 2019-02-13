import { injectable } from "inversify";

@injectable()
export class GameManager {

    private playerList: string [];

    public constructor() {
        this.playerList = [];
    }

    public subscribeSocketID(socketID: string): void {
        this.playerList.push(socketID);
    }

    public unsubscribeSocketID(socketID: string): void {
        this.playerList = this.playerList.filter( (element: String) => element !== socketID);
    }

    public getPlayerList(): string [] {
        return this.playerList;
    }
}
