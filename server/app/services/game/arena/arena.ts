import { GameMode } from "../../../../../common/communication/iCard";



    public sendMessage(playerSocketId: string, event: string, message: number): void {
        this.gameManagerService.sendMessage(playerSocketId, event, message);
    }
}
