import { GameMode } from "../../../../../common/communication/iCard";


    public readonly ARENA_TYPE: GameMode = GameMode.simple;

    public sendMessage(playerSocketId: string, event: string, message: number): void {
        this.gameManagerService.sendMessage(playerSocketId, event, message);
    }
}
