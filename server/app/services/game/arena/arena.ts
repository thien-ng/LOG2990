import { GameMode } from "../../../../../common/communication/iCard";

export class Arena<DIFF_T> {

    public readonly ARENA_TYPE: GameMode = GameMode.simple;
    public DEFAULT_DIFF_TO_UPDATE: DIFF_T;

    public sendMessage(playerSocketId: string, event: string, message: number): void {
        this.gameManagerService.sendMessage(playerSocketId, event, message);
    }
}
