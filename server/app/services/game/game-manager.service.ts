import { injectable } from "inversify";

@injectable()
export class GameManager {

    private playerList: string [];

    public constructor() {
        this.playerList = [];
    }

    public getPlayerList(): string[] {
        return this.playerList;
    }
}
